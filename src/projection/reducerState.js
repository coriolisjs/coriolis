export const createReducerState = (reducer, value, event) => {
  if (typeof reducer !== 'function') {
    throw new TypeError('reducer must be a function')
  }

  const getNextState = (nextEvent) => {
    if (!nextEvent) {
      throw new Error('Needs an event to get a new state')
    }

    if (nextEvent === event) {
      return reducerState
    }

    return createReducerState(reducer, reducer(value, nextEvent), nextEvent)
  }

  const reducerState = {
    getNextState,
    value,
  }

  return reducerState
}

export const getStateValue = (state) => state.value
