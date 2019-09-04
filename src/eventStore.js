import { pipe } from 'rxjs'
import { distinctUntilChanged, filter, map } from 'rxjs/operators'

import { parallelMerge } from './lib/rx/operator/parallel'
import { effect } from './lib/rx/operator/effect'

import { combine } from './lib/function/combine'
import { flatten } from './lib/array/flatten'
import { isDefined } from './lib/variable/isDefined'

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

export const createStore = eventSource => {
  const branches = []
  const getAggregator = createIndex(createAggregator)

  const store = {
    addEffect: (...args) => {
      const inputs = flatten(args)
      const effectOperator = effect(inputs.pop())
      const aggregator = combineAggregators(inputs.map(getAggregator))

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
