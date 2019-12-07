import { identity, noop } from 'rxjs'

import { createIndex } from './lib/map/objectIndex'
import { objectFrom } from './lib/object/objectFrom'
import { variableFunction } from './lib/function/variableFunction'
import { chain } from './lib/function/chain'
import { tryOrNull } from './lib/function/tryOrNull'

// snapshot is a unique aggr that will return every indexed aggregators' last state
// this function must stay uniq, so as an example we must not use noop here
export const snapshot = () => {}

// Builds an aggregator function (receives an event, returns a state) from a reducer function
const createReducerAggregator = (reducer, initialState) => {
  if (typeof reducer !== 'function') {
    throw new TypeError('reducer must be a function')
  }

  let lastEvent
  let lastState = initialState

  const aggregator = event => {
    if (!event) {
      throw new Error('Aggregator called with no event')
    }

    // same event => last state
    if (lastEvent && event === lastEvent.value) {
      return lastState
    }

    lastEvent = { value: event }
    lastState = reducer(lastState, event)

    return lastState
  }

  // We define both getValue and value getter because, depending on context, one
  // can be more readable than the other.
  // getValue is suited when we need to pass a reference to the function, and
  // value getter is best when accessing directly the value
  aggregator.getValue = () => lastState

  Object.defineProperty(aggregator, 'value', {
    configurable: false,
    enumerable: true,
    get: aggregator.getValue
  })

  return aggregator
}

const throwUnexpectedScope = funcName => () => {
  throw new Error(`Unexpected out-of-scope usage of function ${funcName}`)
}

const createAggrSetupAPI = (getLastState, getAggregator) => {
  const using = {
    allEvents: false,
    eventTypes: undefined,
    aggregators: [],
    stateIndex: undefined,
    initialState: undefined,
    skipIndexes: [],
    name: undefined
  }

  const useState = initialValue => {
    if (using.stateIndex !== undefined) {
      throw new Error(
        'useState should be used only once in an aggr definition setup'
      )
    }
    using.initialState = initialValue
    using.stateIndex = using.aggregators.length
    using.aggregators.push(getLastState)
  }

  const useEvent = (...eventTypes) => {
    if (using.eventTypes !== undefined) {
      throw new Error(
        'useEvent should not be called more than once in an aggr definition setup'
      )
    }
    // flag true if catching all events (means skip filtering interesting events)
    using.allEvents = !eventTypes.length
    using.eventTypes = eventTypes.map(eventType => eventType.toString())

    using.aggregators.push(identity)
  }

  const useAggr = aggr => using.aggregators.push(getAggregator(aggr))

  const lazyAggr = aggr => {
    using.skipIndexes.push(using.aggregators.length)
    using.aggregators.push(getAggregator(aggr))
  }

  const useValue = value => using.aggregators.push(() => value)

  const setName = name => {
    using.name = name
  }

  const setupParamsRaw = Object.entries({
    useState,
    useEvent,
    useAggr,
    lazyAggr,
    useValue,
    setName
  }).map(([key, value]) => [key, variableFunction(value)])

  const setupParams = objectFrom(
    setupParamsRaw.map(([key, { func }]) => [key, func])
  )

  const preventOutOfScopeUsage = chain(
    ...setupParamsRaw.map(([key, { setup }]) => () =>
      setup(throwUnexpectedScope(key))
    )
  )

  const isNullSetup = () => using.aggregators.length === 0

  const isReducerSetup = () =>
    (!using.aggregators[0] || using.stateIndex === 0) &&
    (!using.aggregators[1] || using.aggregators[1] === identity) &&
    using.aggregators.length <= 2

  // reducer-like, means it's not in the right order
  const isReducerLikeSetup = () =>
    using.aggregators.length ===
    (using.stateIndex !== undefined) + using.allEvents

  const getLastValues = () =>
    using.aggregators.map(aggregator => aggregator.value)

  const usesEvents = () => using.eventTypes !== undefined

  const getInitialState = () => using.initialState

  const getName = () => using.name

  const createValuesGetter = () => {
    const processAggregators = event =>
      using.aggregators.map(aggregator => aggregator(event))

    if (using.eventTypes) {
      if (using.allEvents) {
        return processAggregators
      }
      return event => {
        // values must be generated every time to ensure each aggregator gets all events
        // So even if we return nothing, we have to process this
        const values = processAggregators(event)

        // we had to execute aggregators and get values, but if the event is not of an interesting
        // type, we just return nothing: this aggregator has nothing to do with this event
        if (!using.eventTypes.includes(event.type)) {
          return
        }

        return values
      }
    }

    let lastValues = getLastValues()
    return event => {
      const values = processAggregators(event)

      const anyChange = values.some(
        (value, idx) =>
          // last state change is not a value change due to current event, it must not count as a change
          idx !== using.stateIndex &&
          !using.skipIndexes.includes(idx) &&
          value !== lastValues[idx]
      )
      lastValues = values

      return anyChange ? values : undefined
    }
  }

  return {
    setupParams,
    getInitialState,
    createValuesGetter,
    isNullSetup,
    isReducerSetup,
    isReducerLikeSetup,
    getLastValues,
    usesEvents,
    preventOutOfScopeUsage,
    getName
  }
}

// builds an aggregator from a complexe aggr definition function
const createComplexAggregator = (aggr, getAggregator) => {
  if (typeof aggr !== 'function') {
    throw new TypeError('Aggr must be a function')
  }

  let aggregator = noop
  const getLastState = () => aggregator.value

  const {
    setupParams,
    getInitialState,
    createValuesGetter,
    isNullSetup,
    isReducerSetup,
    isReducerLikeSetup,
    getLastValues,
    usesEvents,
    preventOutOfScopeUsage,
    getName
  } = createAggrSetupAPI(getLastState, getAggregator)

  // aggr could be a reducer, calling it with setupParams could lead to an exception
  // If we get an exception, we will handle aggr as a reducer, so we don't need
  // resulting Error, we just need to know there was one. Let's try, or get null
  const aggrBehavior = tryOrNull(() => aggr(setupParams))
  preventOutOfScopeUsage()

  if (isNullSetup() || typeof aggrBehavior !== 'function') {
    if (aggrBehavior === null) {
      // If it's null, we got an error. To avoid making an error completely disapear it
      // is probably better to display this information in console
      // TODO: ensure this behavior is the good one
      console.info(
        "Aggr setup failure, let's use it as a reducer",
        aggr.name,
        aggr,
        aggrBehavior
      )
    }
    // reducer aggr with optional parameters could lead here.
    // let's assume aggr is in fact a reducer
    return createReducerAggregator(aggr)
  }

  const name = getName()
  if (name) {
    Object.defineProperty(aggr, 'name', {
      value: name,
      writable: false
    })
  }

  // if given aggregator definition expects only state and event (or less), it should be a reducer
  if (isReducerLikeSetup()) {
    console.info(
      'Prefer using simple reducer signature " (state, event) => newstate " ' +
        'when you only need state and/or event'
    )

    // Replace with getAggregator in case signature matches reducer signature (state, event)
    if (isReducerSetup()) {
      return getAggregator(aggrBehavior)
    }
  }

  const getValues = createValuesGetter()

  const initialState = getInitialState()

  const finalInitialState =
    initialState !== undefined
      ? initialState
      : !usesEvents()
        ? aggrBehavior(...getLastValues())
        : undefined

  aggregator = createReducerAggregator((lastState, event) => {
    const values = getValues(event)

    if (!values) {
      return lastState
    }

    return aggrBehavior(...values)
  }, finalInitialState)

  return aggregator
}

// There's two cases (reducer or complex aggregator) but we want a single access point so we have to
// guess whether it's a reducer or a complex aggregator definition
// - reducer definition is a function with two parameters
// - complex aggregator definition is a function with only one parameter
// If this guess is not accurate, we should handle aggregator definition as complex aggregator because in
// complex aggregator handling process there's fallbacks to ensure it works even if a reducer is passed
export const createAggregator = (aggr, getAggregator = createAggregator) =>
  aggr && aggr.length === 2
    ? createReducerAggregator(aggr)
    : createComplexAggregator(aggr, getAggregator)

export const createAggregatorFactory = (
  aggregatorBuilder = createAggregator
) => {
  const factory = createIndex(aggr =>
    aggr === snapshot ? getSnapshot : aggregatorBuilder(aggr, factory.get)
  )

  // to build a snapshot, we get the current state from each aggregator and put
  // all this in an object, using aggregator definition's name as keys. If any conflicts
  // on names, numbers are concatenated on conflicting keys (aKey, aKey-2, aKey-3...)
  const getSnapshot = () =>
    objectFrom(
      factory
        .list()
        // we don't want to list snapshot aggregator's state as it would cause a recursive loop
        .filter(([aggr]) => aggr !== snapshot)
        .map(([aggr, aggregator]) => [aggr.name, aggregator.value])
    )

  getSnapshot.getValue = getSnapshot

  Object.defineProperty(getSnapshot, 'value', {
    get: getSnapshot
  })

  return factory.get
}
