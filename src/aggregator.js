import { identity, noop } from 'rxjs'

const createReducerAggregator = reducer => {
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

const handleAggregatorSetup = (getLastState, getAggregator) => {
  const using = {
    aggr: []
  }

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

  const setupParams = {
    useState,
    useEvent,
    useAggr
  }

  const isNullSetup = () => using.aggr.length === 0

  const isReducerSetup = () =>
    (!using.aggr[0] || using.aggr[0] === getLastState) &&
    (!using.aggr[1] || using.aggr[1] === identity)

  const isReducerLikeSetup = () =>
    using.aggr.length === (using.state + using.event)

  let lastValues = []
  const getValues = event => {
    const values = using.aggr.map(aggr => aggr(event))

    if (using.event) {
      return values
    }

    const anyChange = values.some((item, idx) => item !== lastValues[idx])
    lastValues = values

    return anyChange ? values : undefined
  }

  return {
    setupParams,
    getValues,
    isNullSetup,
    isReducerSetup,
    isReducerLikeSetup
  }
}

const createComplexAggregator = (setupAggregator, getAggregator) => {
  if (typeof setupAggregator !== 'function') {
    throw new TypeError('Aggregator definition must be a function')
  }

  let aggrBehaviour

  let aggregate = noop
  const getLastState = () => aggregate()

  const {
    setupParams,
    getValues,
    isNullSetup,
    isReducerSetup,
    isReducerLikeSetup
  } = handleAggregatorSetup(getLastState, getAggregator)

  try {
    aggrBehaviour = setupAggregator(setupParams)
  } catch (error) {
    // setup failed, let's assume setupAggregator is in fact a reducer
    return createReducerAggregator(setupAggregator)
  }

  if (isNullSetup() || typeof aggrBehaviour !== 'function') {
    // giving a reducer with optional parameters could lead here.
    // let's assume setupAggregator is in fact a reducer
    return createReducerAggregator(setupAggregator)
  }

  // if given aggregator definition expects only state and event (or less), it should be a reducer
  if (isReducerLikeSetup()) {
    console.warn('Prefer using simple reducer signature when you only need state and/or event')

    // Replace with getAggregator in case signature matches reducer signature (state, event)
    if (isReducerSetup()) {
      return getAggregator(aggrBehaviour)
    }
  }

  aggregate = createReducerAggregator((lastState, event) => {
    const values = getValues(event)

    if (!values) {
      return lastState
    }

    return aggrBehaviour(...values)
  })

  return aggregate
}

export const createAggregator = (setupAggregator, getAggregator) =>
  (setupAggregator && setupAggregator.length === 2)
    ? createReducerAggregator(setupAggregator)
    : createComplexAggregator(setupAggregator, getAggregator)
