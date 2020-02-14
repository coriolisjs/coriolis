import { identity, noop } from 'rxjs'

import { createIndex } from './lib/map/objectIndex'
import { objectFrom } from './lib/object/objectFrom'
import { withValueGetter } from './lib/object/valueGetter'
import { variableFunction } from './lib/function/variableFunction'
import { chain } from './lib/function/chain'

// snapshot is a unique projection that will return every indexed projections' last state
// this function must be an unique reference, so as an example we must not use rxjs' noop here
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

  return withValueGetter(aggregator, () => lastState)
}

const throwUnexpectedScope = funcName => () => {
  throw new Error(`Unexpected out-of-scope usage of function ${funcName}`)
}

const createProjectionSetupAPI = (getLastState, getAggregator) => {
  const using = {
    allEvents: false,
    eventTypes: undefined,
    aggregators: [],
    stateIndex: undefined,
    initialState: undefined,
    skipIndexes: [],
    name: undefined,
  }

  const useState = initialValue => {
    if (using.stateIndex !== undefined) {
      throw new Error(
        'useState should be used only once in an projection definition setup',
      )
    }
    using.initialState = initialValue
    using.stateIndex = using.aggregators.length
    using.aggregators.push(getLastState)
  }

  const useEvent = (...eventTypes) => {
    if (using.eventTypes !== undefined) {
      throw new Error(
        'useEvent should not be called more than once in an projection definition setup',
      )
    }
    // flag true if catching all events (means skip filtering interesting events)
    using.allEvents = !eventTypes.length
    using.eventTypes = eventTypes.map(eventType => eventType.toString())

    using.aggregators.push(identity)
  }

  const useProjection = projection =>
    using.aggregators.push(getAggregator(projection))

  const lazyProjection = projection => {
    using.skipIndexes.push(using.aggregators.length)
    using.aggregators.push(getAggregator(projection))
  }

  const useValue = value => using.aggregators.push(withValueGetter(() => value))

  const setName = name => {
    using.name = name
  }

  const setupParamsRaw = Object.entries({
    useState,
    useEvent,
    useProjection,
    lazyProjection,
    useValue,
    setName,
  }).map(([key, value]) => [key, variableFunction(value)])

  const setupParams = objectFrom(
    setupParamsRaw.map(([key, { func }]) => [key, func]),
  )

  const preventOutOfScopeUsage = chain(
    ...setupParamsRaw.map(([key, { setup }]) => () =>
      setup(throwUnexpectedScope(key)),
    ),
  )

  const isNullSetup = () => using.aggregators.length === 0

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
          value !== lastValues[idx],
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
    getLastValues,
    usesEvents,
    preventOutOfScopeUsage,
    getName,
  }
}

const tryProjection = (projection, params) => {
  try {
    return projection(params)
  } catch (error) {
    error.message = `Projection execution error: ${error.message}`
    throw error
  }
}

export const createAggregator = (
  projection,
  getAggregator = createAggregator,
) => {
  if (typeof projection !== 'function') {
    throw new TypeError('Projection must be a function')
  }

  let aggregator = noop
  const getLastState = () => aggregator.value

  const {
    setupParams,
    getInitialState,
    createValuesGetter,
    isNullSetup,
    getLastValues,
    usesEvents,
    preventOutOfScopeUsage,
    getName,
  } = createProjectionSetupAPI(getLastState, getAggregator)

  const projectionBehavior = tryProjection(projection, setupParams)
  preventOutOfScopeUsage()

  if (isNullSetup() || typeof projectionBehavior !== 'function') {
    throw new TypeError('Given projection is not working')
  }

  const getValues = createValuesGetter()

  const initialState = getInitialState()

  const finalInitialState =
    initialState !== undefined
      ? initialState
      : !usesEvents()
      ? projectionBehavior(...getLastValues())
      : undefined

  aggregator = createReducerAggregator((lastState, event) => {
    const values = getValues(event)

    if (!values) {
      return lastState
    }

    return projectionBehavior(...values)
  }, finalInitialState)

  const name = getName()
  if (name) {
    Object.defineProperty(projection, 'name', {
      value: name,
      writable: false,
    })
  }

  return aggregator
}

export const createAggregatorFactory = (
  aggregatorBuilder = createAggregator,
) => {
  const factory = createIndex(projection =>
    projection === snapshot
      ? getSnapshot
      : aggregatorBuilder(projection, factory.get),
  )

  // to build a snapshot, we get the current state from each aggregator and put
  // all this in an object, using aggregator definition's name as keys. If any conflicts
  // on names, numbers are concatenated on conflicting keys (aKey, aKey-2, aKey-3...)
  const getSnapshot = withValueGetter(() =>
    objectFrom(
      factory
        .list()
        // we don't want to list snapshot aggregator's state as it would cause a recursive loop
        .filter(([projection]) => projection !== snapshot)
        .map(([projection, aggregator]) => [projection.name, aggregator.value]),
    ),
  )

  return factory.get
}

export const fromReducer = createIndex(reducer => ({ useState, useEvent }) => (
  useState(), useEvent(), reducer
)).get
