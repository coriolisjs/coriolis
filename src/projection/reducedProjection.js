export const createReducedProjection = (reducer, value, event) => {
  if (typeof reducer !== 'function') {
    throw new TypeError('reducer must be a function')
  }

  const getNextState = (nextEvent) => {
    if (!nextEvent) {
      throw new Error('Needs an event to get a new state')
    }

    if (nextEvent === event) {
      return reducedProjection
    }

    return createReducedProjection(
      reducer,
      reducer(value, nextEvent),
      nextEvent,
    )
  }

  const reducedProjection = {
    name: reducer.name,
    stateless: !!reducer.stateless,
    getNextState,
    value,
  }

  return reducedProjection
}

export const getStateValue = (state) => state.value
