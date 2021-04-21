export const createReducedProjection = (reducer, value, event, error) => {
  if (typeof reducer !== 'function') {
    throw new TypeError('reducer must be a function')
  }

  const getNextState = (nextEvent) => {
    if (!nextEvent) {
      throw new Error('Needs an event to get a new state')
    }

    if (error) {
      return reducedProjection
    }

    if (nextEvent === event) {
      return reducedProjection
    }

    try {
      return createReducedProjection(
        reducer,
        reducer(value, nextEvent),
        nextEvent,
      )
    } catch (error) {
      return createReducedProjection(reducer, value, nextEvent, error)
    }
  }

  const reducedProjection = {
    name: reducer.name,
    stateless: !!reducer.stateless,
    getNextState,
    value,
    ...(error && { error }),
  }

  return reducedProjection
}

export const getReducedProjectionValue = (reducedProjection) => {
  if (reducedProjection.error) {
    throw reducedProjection.error
  }

  return reducedProjection.value
}
