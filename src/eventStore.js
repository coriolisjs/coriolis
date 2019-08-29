const { pipe } = require('rxjs')
const { distinctUntilChanged, filter, map } = require('rxjs/operators')

const { parallelMerge } = require('./lib/rx/operator/parallel')
const { effect } = require('./lib/rx/operator/effect')

const { combine } = require('./lib/fp/combine')
const { isDefined } = require('./lib/isDefined')

const createIndex = getValue => {
  const index = []

  const get = key => {
    const indexed = index.find(item => item.key === key)

    if (indexed) {
      return indexed.value
    }

    const value = getValue(key, get)

    index.push({ key, value })

    return value
  }

  return get
}

const createAggregator = (reducer, getAggregator) => {
  let lastEvent
  let lastResult

  return event => {
    if (!lastEvent || event !== lastEvent.value) {
      lastEvent = { value: event }

      // useReducer will use getAggregator
      // getAggregator uses a slow indexing solution
      // If this causes latency, we can add local cache on this function call
      const useReducer = reducer => () => getAggregator(reducer)(event)

      lastResult = reducer(lastResult, event, useReducer)
    }

    return lastResult
  }
}

const combineAggregators = aggregators => {
  const getData = combine(aggregators)
  const initialState = aggregators.map(() => undefined)
  let prev = initialState

  return event => {
    const newData = getData(event)

    const hasChanged = newData.some((data, idx) => data !== prev[idx])

    // if each aggregator returns the same data as previous call, we want to return the
    // exact same result, so === operator can be used to know something changed
    prev = hasChanged ? newData : prev

    return prev !== initialState ? prev : undefined
  }
}

const createStore = eventSource => {
  const branches = []
  const getAggregator = createIndex(createAggregator)

  const store = {
    addEffect: (...args) => {
      const effectOperator = effect(args.pop())
      const aggregator = combineAggregators(args.map(getAggregator))

      const branch = pipe(
        map(aggregator),
        filter(isDefined),
        distinctUntilChanged(),
        effectOperator
      )

      branches.push(branch)

      return store
    },

    init: () => {
      if (!branches.length) {
        throw new Error('No effect defined. This is useless')
      }

      return eventSource
        .pipe(parallelMerge(...branches))
        .subscribe(eventSource).unsubscribe
    }
  }

  return store
}

module.exports = {
  createStore
}
