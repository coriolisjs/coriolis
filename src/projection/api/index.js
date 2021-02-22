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

const getPostTreatmentData = (settings) => (
  projectionBehavior,
  getStateFlow,
) => {
  const stateFlows = settings.sources.map((source) => {
    if (source === sourceState) {
      return { getValue: noop, getNextValue: noop }
    }

    if (source === sourceEvent) {
      return { getValue: noop, getNextValue: identity }
    }

    if (typeof source !== 'function') {
      const getValue = () => source.value
      return {
        getValue,
        getNextValue: getValue,
      }
    }

    if (Array.isArray(source)) {
      return getStateFlow(...source)
    }

    return getStateFlow(source)
  })

  const initialInputs =
    !settings.eventTypes && stateFlows.map(({ getValue }) => getValue())

  const initialState =
    settings.initialState !== undefined
      ? settings.initialState
      : !settings.eventTypes
      ? projectionBehavior(...initialInputs)
      : undefined

  const getInputs = createInputsGetter(
    initialInputs,
    stateFlows,
    settings.stateIndex,
    settings.allEvents,
    settings.eventTypes,
    settings.skipIndexes,
  )

  const stateless = settings.stateIndex === undefined

  return {
    name: settings.name,
    isNullSetup: settings.sources.length === 0,
    initialState,
    getInputs,
    stateless,
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
    ...setupAPIRaw.map(([key, { setup }]) => () =>
      setup(throwUnexpectedScope(key)),
    ),
  )

  return {
    setupAPI,
    preventOutOfScopeUsage,
    getPostTreatmentData: getPostTreatmentData(settings),
  }
}
