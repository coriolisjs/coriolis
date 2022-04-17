import { variableFunction } from '../../lib/function/variableFunction'
import { chain } from '../../lib/function/chain'
import { objectFrom } from '../../lib/object/objectFrom'
import { noop } from '../../lib/function/noop'
import { identity } from '../../lib/function/identity'

import { useState, sourceState } from './useState'
import { useEvent, sourceEvent } from './useEvent'
import { useProjection } from './useProjection'
import { useValue } from './useValue'
import { setName } from './setName'

const throwUnexpectedScope = (funcName) => () => {
  throw new Error(`Unexpected out-of-scope usage of function ${funcName}`)
}

const createInputsGetter = (
  initialInputs,
  stateFlows,
  stateIndex,
  allEvents,
  eventTypes,
  skipIndexes,
) => {
  const processInputs = (currentState, event) =>
    stateFlows.map((stateFlow, idx) =>
      idx === stateIndex ? currentState : stateFlow.getNextValue(event),
    )

  if (allEvents) {
    return processInputs
  }

  if (eventTypes) {
    return (state, event) => {
      // inputs must be generated every time to ensure every projection process each event
      // So even if we return nothing, we have to process this
      const inputs = processInputs(state, event)

      // we had to process inputs, but if the event is not of an interesting
      // type, we just return nothing: this projection has nothing to output with this event
      if (!eventTypes.includes(event.type)) {
        return
      }

      return inputs
    }
  }

  let lastInputs = initialInputs

  return (state, event) => {
    const inputs = processInputs(state, event)

    const anyChange = inputs.some(
      (value, idx) =>
        // last state change is not a value change due to current event, it must not count as a change
        idx !== stateIndex &&
        !skipIndexes.includes(idx) &&
        value !== lastInputs[idx],
    )
    lastInputs = inputs

    return anyChange ? inputs : undefined
  }
}

const getPostTreatmentData =
  (settings) => (name, projectionBehavior, getStateFlow) => {
    if (typeof projectionBehavior !== 'function') {
      throw new TypeError('Given projection is not working')
    }

    const finalName = settings.name || name

    const finalProjectionBehavior = (...args) => {
      try {
        return projectionBehavior(...args)
      } catch (error) {
        error.message = `Projection "${finalName}" execution error: ${error.message}`
        throw error
      }
    }

    const stateFlows = settings.sources.map((source) => {
      if (source === sourceState) {
        return { getValue: noop, getNextValue: noop }
      }

      if (source === sourceEvent) {
        return { getValue: noop, getNextValue: identity }
      }

      // Two possible projection definition types :
      // - ['reducer', (state, event) => newstate, initialState]
      // - projection
      // a third valid solution is [projection], but it seems useless
      if (typeof source === 'function') {
        return getStateFlow(source)
      }

      if (Array.isArray(source)) {
        // for stateFlowFactory indexation to work properly it needs to receive each param separatly, not as an array
        return getStateFlow(...source)
      }

      // last possible solution: a static value
      const getValue = () => source.value
      return {
        getValue,
        getNextValue: getValue,
      }
    })

    const initialInputs =
      !settings.eventTypes && stateFlows.map(({ getValue }) => getValue())

    const initialState =
      settings.initialState !== undefined
        ? settings.initialState
        : !settings.eventTypes
        ? finalProjectionBehavior(...initialInputs)
        : undefined

    const getInputs = createInputsGetter(
      initialInputs,
      stateFlows,
      settings.stateIndex,
      settings.allEvents,
      settings.eventTypes,
      settings.skipIndexes,
    )

    // projection using any event is statefull:
    //   Value can not be defined without the previous event, this is a kind of state
    const stateless = settings.stateIndex === undefined && !settings.eventTypes

    return {
      name: finalName,
      isNullSetup: settings.sources.length === 0,
      initialState,
      getInputs,
      stateless,
      finalProjectionBehavior,
    }
  }

export const createProjectionSetupAPI = () => {
  const settings = {
    allEvents: false,
    eventTypes: undefined,
    sources: [],
    stateIndex: undefined,
    initialState: undefined,
    skipIndexes: [],
    name: undefined,
  }

  const setupAPIRaw = Object.entries({
    useState: useState(settings),
    useEvent: useEvent(settings),
    useProjection: useProjection(settings),
    useValue: useValue(settings),
    setName: setName(settings),
  }).map(([key, value]) => [key, variableFunction(value)])

  const setupAPI = objectFrom(setupAPIRaw.map(([key, { func }]) => [key, func]))

  const preventOutOfScopeUsage = chain(
    ...setupAPIRaw.map(
      ([key, { setup }]) =>
        () =>
          setup(throwUnexpectedScope(key)),
    ),
  )

  return {
    setupAPI,
    preventOutOfScopeUsage,
    getPostTreatmentData: getPostTreatmentData(settings),
  }
}
