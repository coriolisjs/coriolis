import { identity, noop } from 'rxjs'

export const createReducerAggregator = reducer => {
  if (typeof reducer !== 'function') {
    throw new TypeError('reducer must be a function')
  }

  let lastEvent
  let lastState

  return event => {
    // in any case, same event => last state, no event => last state
    if (!event || (lastEvent && event === lastEvent.value)) {
      return lastState
    }

    lastEvent = { value: event }

    lastState = reducer(lastState, event)

    return lastState
  }
}

export const createComplexAggregator = (setupAggregator, getAggregator) => {
  if (typeof setupAggregator !== 'function') {
    throw new TypeError('setupAggregator must be a function')
  }

  let lastValues = []
  let aggrBehaviour = noop

  const using = {
    aggr: []
  }

  const getValues = event => {
    const values = using.aggr.map(aggr => aggr(event))

    if (using.event) {
      return values
    }

    const anyChange = values.some((item, idx) => item !== lastValues[idx])

    return anyChange ? values : lastValues
  }

  const aggregate = createReducerAggregator((lastState, event) => {
    const values = getValues(event)

    if (values === lastValues) {
      return lastState
    }

    lastValues = values

    return aggrBehaviour(...values)
  })

  const getLastState = () => aggregate()

  const useState = () => {
    using.state = true
    using.aggr.push(getLastState)
  }

  const useEvent = () => {
    using.event = true
    using.aggr.push(identity)
  }

  const useAggr = aggr =>
    using.aggr.push(getAggregator(aggr))

  try {
    aggrBehaviour = setupAggregator({
      useState,
      useEvent,
      useAggr
    })
  } catch (error) {
    // setup failed, let's assume setupAggregator is in fact a reducer
    return createReducerAggregator(setupAggregator)
  }

  if (using.aggr.length === 0 || typeof aggrBehaviour !== 'function') {
    // giving a reducer with optional parameters could lead here.
    // let's assume setupAggregator is in fact a reducer
    return createReducerAggregator(setupAggregator)
  }

  // if given aggregator definition expects only state and event (or less), it should be a reducer
  if (using.aggr.length === (using.state + using.event)) {
    console.warn('Prefer using reducer when only needs state and/or event')

    // Replace with getAggregator in case signature matches reducer signature (state, event)
    if (
      (!using.aggr[0] || using.aggr[0] === getLastState) &&
      (!using.aggr[1] || using.aggr[1] === identity)
    ) {
      return getAggregator(aggrBehaviour)
    }
  }

  return aggregate
}

export const createAggregator = (setupAggregator, getAggregator) =>
  setupAggregator.length === 2
    ? createReducerAggregator(setupAggregator)
    : createComplexAggregator(setupAggregator, getAggregator)
