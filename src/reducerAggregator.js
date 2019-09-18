export const createReducerAggregator = reducer => {
  if (typeof reducer !== 'function') {
    throw new TypeError('reducer must be a function')
  }

  let lastEvent
  let lastState

  return event => {
    // In any case, same event > same result
    if (lastEvent && event === lastEvent.value) {
      return lastState
    }

    lastEvent = { value: event }
    lastState = reducer(lastState, event)

    return lastState
  }
}
