import { identity, noop } from 'rxjs'

import { createIndex } from './lib/map/objectIndex'
import { objectFrom } from './lib/object/objectFrom'
import { variableFunction } from './lib/function/variableFunction'
import { chain } from './lib/function/chain'
import { tryOrNull } from './lib/function/tryOrNull'

// snapshot is a unique aggr that will return all indexed aggregators' last state
export const snapshot = () => {}

// aggr wrapper that allow an aggr to be parametered and still have shared cached results
export const parameteredAggr = aggr =>
  createIndex((...args) => aggrAPI => {
    let count = 0

    const useParam = (idx = count++) => aggrAPI.useValue(args[idx])
    const useParameteredEvent = (from = 0, to) => aggrAPI.useEvent(...args.slice(from, to))
    const useParameteredAggr = (parameteredAggr, from = 0, to) => aggrAPI.useAggr(parameteredAggr(...args.slice(from, to)))
    return aggr({
      useParam,
      useParameteredEvent,
      useParameteredAggr,
      ...aggrAPI
    })
  }).get

// Builds an aggregator function (receives an event, returns a state) from a reducer function
const createReducerAggregator = (reducer, initialState) => {
  if (typeof reducer !== 'function') {
    throw new TypeError('reducer must be a function')
  }

  let lastEvent
  let lastState = initialState

  const aggregator = event => {
    // in any case, same event => last state, no event => last state
    if (!event || (lastEvent && event === lastEvent.value)) {
      return lastState
    }

    lastEvent = { value: event }
    lastState = reducer(lastState, event)

    return lastState
  }

  aggregator.initialState = initialState

  // TODO: here we could also add a getter property for lastState to make it
  // more clear it is the last state we are accessing (instead of calling aggregator without event)

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
    skipIndexes: []
  }

  const useState = (initialValue) => {
    if (using.stateIndex !== undefined) {
      throw new Error('useState should be used only once in an aggr definition setup')
    }
    using.initialState = initialValue
    using.stateIndex = using.aggregators.length
    using.aggregators.push(getLastState)
  }

  const useEvent = (...eventTypes) => {
    if (using.eventTypes !== undefined) {
      throw new Error('useEvent should not be called more than once in an aggr definition setup')
    }
    // flag true if catching all events (means skip filtering interesting events)
    using.allEvents = !eventTypes.length
    using.eventTypes = eventTypes.map(eventType => eventType.toString())

    using.aggregators.push(identity)
  }

  const useAggr = aggr =>
    using.aggregators.push(getAggregator(aggr))

  const lazyAggr = aggr => {
    using.skipIndexes.push(using.aggregators.length)
    using.aggregators.push(getAggregator(aggr))
  }

  const useValue = value => using.aggregators.push(() => value)

  const setupParamsRaw = Object.entries({
    useState,
    useEvent,
    useAggr,
    lazyAggr,
    useValue
  })
    .map(([key, value]) => [key, variableFunction(value)])

  const setupParams = objectFrom(setupParamsRaw.map(([key, { func }]) => [key, func]))

  const preventOutOfScopeUsage = chain(
    ...setupParamsRaw
      .map(([key, { setup }]) => () => setup(throwUnexpectedScope(key)))
  )

  const isNullSetup = () => using.aggregators.length === 0

  const isReducerSetup = () =>
    (!using.aggregators[0] || using.stateIndex === 0) &&
    (!using.aggregators[1] || using.aggregators[1] === identity) &&
    using.aggregators.length <= 2

  // reducer-like, means it's not in the right order
  const isReducerLikeSetup = () =>
    using.aggregators.length === ((using.stateIndex !== undefined) + using.allEvents)

  const getInitialState = () => using.initialState

  const createValuesGetter = () => {
    const processAggregators = event => using.aggregators.map(aggregator => aggregator(event))
    if (using.eventTypes) {
      if (using.allEvents) {
        return processAggregators
      }
      return event => {
        // values must be generated every time to ensure each aggregator gets all events
        // So even if we return nothing, we have to process this
        const values = processAggregators(event)

        if (!using.eventTypes.includes(event.type)) {
          return
        }

        return values
      }
    }

    let lastValues = using.aggregators.map(aggregator => aggregator.initialState)
    return event => {
      const values = processAggregators(event)

      const anyChange = values.some((value, idx) =>
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
    preventOutOfScopeUsage
  }
}

// builds an aggregator from a complexe aggr definition function
const createComplexAggregator = (aggr, getAggregator) => {
  if (typeof aggr !== 'function') {
    throw new TypeError('Aggr must be a function')
  }

  let aggregator = noop
  const getLastState = () => aggregator()

  const {
    setupParams,
    getInitialState,
    createValuesGetter,
    isNullSetup,
    isReducerSetup,
    isReducerLikeSetup,
    preventOutOfScopeUsage
  } = createAggrSetupAPI(getLastState, getAggregator)

  const aggrBehavior = tryOrNull(() => aggr(setupParams))
  preventOutOfScopeUsage()

  if (isNullSetup() || typeof aggrBehavior !== 'function') {
    if (aggrBehavior === null) {
      console.info('Aggr setup failure, let\'s use it as a reducer', aggr.name, aggr, aggrBehavior)
    }
    // reducer aggr with optional parameters could lead here.
    // let's assume aggr is in fact a reducer
    return createReducerAggregator(aggr)
  }

  // if given aggregator definition expects only state and event (or less), it should be a reducer
  if (isReducerLikeSetup()) {
    console.info('Prefer using simple reducer signature " (state, event) => newstate " when you only need state and/or event')

    // Replace with getAggregator in case signature matches reducer signature (state, event)
    if (isReducerSetup()) {
      return getAggregator(aggrBehavior)
    }
  }

  const getValues = createValuesGetter()

  aggregator = createReducerAggregator(
    (lastState, event) => {
      const values = getValues(event)

      if (!values) {
        return lastState
      }

      return aggrBehavior(...values)
    },
    getInitialState()
  )

  return aggregator
}

// There's two cases (reducer or complex aggregator) but we want a single access point so we have to
// guess whether it's a reducer or a complex aggregator definition
// - reducer definition is a function with two parameters
// - complex aggregator definition is a function with only one parameter
// If this guess is not accurate, we should handle aggregator definition as complex aggregator because in
// complex aggregator handling process there's fallbacks to ensure it works even if a reducer is passed
export const createAggregator = (aggr, getAggregator = createAggregator) =>
  (aggr && aggr.length === 2)
    ? createReducerAggregator(aggr)
    : createComplexAggregator(aggr, getAggregator)

export const createAggregatorFactory = (aggregatorBuilder = createAggregator) => {
  const factory = createIndex(
    aggr =>
      aggr === snapshot
        ? getSnapshot
        : aggregatorBuilder(aggr, factory.get)
  )

  // to build a snapshot, we get the current state from each aggregator and put
  // all this in an object, using aggregator definition's name as keys. If any conflicts
  // on names, numbers are concatenated on conflicting keys (aKey, aKey-2, aKey-3...)
  const getSnapshot = () => objectFrom(
    factory.list()
      // we don't want to list snapshot aggregator's state as it would cause a recursive loop
      .filter(([aggr]) => aggr !== snapshot)
      .map(([aggr, aggregator]) => [aggr.name, aggregator()])
  )

  return factory
}
