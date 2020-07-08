import { withValueGetter } from '../lib/object/valueGetter'

// Builds an aggregator function (receives an event, returns a state) from a reducer function
export const createReducerAggregator = (reducer, initialState) => {
  if (typeof reducer !== 'function') {
    throw new TypeError('reducer must be a function')
  }

  let lastEvent
  let lastState = initialState

  const aggregator = (event) => {
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
