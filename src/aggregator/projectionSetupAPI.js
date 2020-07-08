import { identity } from '../lib/function/identity'
import { variableFunction } from '../lib/function/variableFunction'
import { chain } from '../lib/function/chain'
import { withValueGetter } from '../lib/object/valueGetter'
import { objectFrom } from '../lib/object/objectFrom'

const throwUnexpectedScope = (funcName) => () => {
  throw new Error(`Unexpected out-of-scope usage of function ${funcName}`)
}

export const createProjectionSetupAPI = (getLastState, getAggregator) => {
  const using = {
    allEvents: false,
    eventTypes: undefined,
    aggregators: [],
    stateIndex: undefined,
    initialState: undefined,
    skipIndexes: [],
    name: undefined,
  }

  const useState = (initialValue) => {
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
    using.eventTypes = eventTypes.map((eventType) => eventType.toString())

    using.aggregators.push(identity)
  }

  const useProjection = (projection) =>
    using.aggregators.push(getAggregator(projection))

  const lazyProjection = (projection) => {
    using.skipIndexes.push(using.aggregators.length)
    using.aggregators.push(getAggregator(projection))
  }

  const useValue = (value) =>
    using.aggregators.push(withValueGetter(() => value))

  const setName = (name) => {
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
    using.aggregators.map((aggregator) => aggregator.value)

  const usesEvents = () => using.eventTypes !== undefined

  const getInitialState = () => using.initialState

  const getName = () => using.name

  const createValuesGetter = () => {
    const processAggregators = (event) =>
      using.aggregators.map((aggregator) => aggregator(event))

    if (using.eventTypes) {
      if (using.allEvents) {
        return processAggregators
      }
      return (event) => {
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
    return (event) => {
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
