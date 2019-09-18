import { identity } from 'rxjs'

export const createAggregator = (aggr, getAggregator, getReducer) => {
  if (typeof aggr !== 'function') {
    throw new TypeError('Aggr must be a function')
  }

  let lastEvent
  let lastState
  let lastValues = []

  const using = {
    aggr: []
  }

  const getLastState = () => lastState

  const useState = () => {
    using.state = true
    using.aggr.push(getLastState)
  }

  const useEvent = () => {
    using.event = true
    using.aggr.push(identity)
  }

  const useIndexed = getIndexed => obj =>
    using.aggr.push(getIndexed(obj))

  const useAggr = useIndexed(getAggregator)
  const useReducer = useIndexed(getReducer)

  const aggrBehaviour = aggr({
    useState,
    useEvent,
    useAggr,
    useReducer
  })

  // if given aggregator definition expects only state and event (or less), it should be a reducer
  if (using.aggr.length === (using.state + using.event)) {
    console.warn('Prefer using reducer when only needs state or event')

    // Replace with getReducer in case signature matches reducer signature (state, event)
    if (
      (!using.aggr[0] || using.aggr[0] === getLastState) &&
      (!using.aggr[1] || using.aggr[1] === identity)
    ) {
      return getReducer(aggrBehaviour)
    }
  }

  return event => {
    // in any case, same event > same result
    if (lastEvent && event === lastEvent.value) {
      return lastState
    }

    lastEvent = { value: event }

    const values = using.aggr.map(aggr => aggr(event))

    const anyChange = using.event || values.some((item, idx) => item !== lastValues[idx])

    if (!anyChange) {
      return lastState
    }

    lastValues = values

    lastState = aggrBehaviour(...values)

    return lastState
  }
}
