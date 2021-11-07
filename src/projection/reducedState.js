export const createReducedState = (reducer, value, event, error) => {
  if (typeof reducer !== 'function') {
    throw new TypeError('reducer must be a function')
  }

  const getNextState = (nextEvent) => {
    if (!nextEvent) {
      throw new Error('Needs an event to get a new state')
    }

    if (error) {
      return reducedState
    }

    if (nextEvent === event) {
      return reducedState
    }

    try {
      return createReducedState(reducer, reducer(value, nextEvent), nextEvent)
    } catch (error) {
      return createReducedState(reducer, value, nextEvent, error)
    }
  }

  const reducedState = {
    name: reducer.name,
    stateless: !!reducer.stateless,
    getNextState,
    value,
    ...(error && { error }),
  }

  return reducedState
}

export const getReducedStateValue = (reducedState) => {
  if (reducedState.error) {
    throw reducedState.error
  }

  return reducedState.value
}
