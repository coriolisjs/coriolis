import { pipe } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'

import { parallelMerge } from './lib/rx/operator/parallel'
import { effect } from './lib/rx/operator/effect'

import { createIndex } from './lib/objectIndex'

const createAggregator = (reducer, getAggregator) => {
  let lastEvent
  let lastResult

  return event => {
    if (!lastEvent || event !== lastEvent.value) {
      lastEvent = { value: event }

      // useReducer will use getAggregator
      // getAggregator uses a relatively slow indexing solution (cf: ./lib/objectIndex.js)
      // If this causes latency, we could add local cache on this function call to ensure quick access
      // Or getAggregator's indexing solution could be improved
      const useReducer = reducer => () => getAggregator(reducer)(event)

      lastResult = reducer(lastResult, event, useReducer)
    }

    return lastResult
  }
}

export const createStore = eventSource => {
  const branches = []
  const getAggregator = createIndex(createAggregator)

  const store = {
    addEffect: effectWithReducersSubscriber => {
      const effectSubscriber = effectSubject => {
        const useReducer = reducer =>
          effectSubject.pipe(
            map(getAggregator(reducer)),
            distinctUntilChanged()
          )

        effectWithReducersSubscriber(effectSubject, useReducer)
      }

      branches.push(pipe(
        effect(effectSubscriber)
      ))

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
