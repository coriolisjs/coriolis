import { noop } from '../lib/function/noop'

import { createReducerAggregator } from './reducerAggregator'
import { createProjectionSetupAPI } from './projectionSetupAPI'

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
