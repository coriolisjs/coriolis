import { ReplaySubject } from 'rxjs'
import { distinctUntilChanged, filter, map, take, tap, startWith, skipUntil, shareReplay } from 'rxjs/operators'

import { parallelMerge } from './lib/rx/operator/parallel'
import { effect } from './lib/rx/operator/effect'

import { createIndex } from './lib/objectIndex'

const INITIAL_EVENT_TYPE = 'INITIAL_EVENT'

// TODO: Could be split in two: createMemoizedAggregator and withUseReducer
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

const hasPayload = payload => event => event.payload === payload

// TODO: Convert this builder pattern to a single subscribe pattern to avoid questions about multiple calls to init and so
export const createStore = eventSource => {
  const initialPayload = {}
  const branches = []

  const getAggregator = createIndex(createAggregator)

  const replayCaster = new ReplaySubject(1)

  const initDone$ = replayCaster.pipe(
    filter(hasPayload(initialPayload)),
    take(1),
    shareReplay(1)
  )

  const pipeReducer = reducer =>
    replayCaster.pipe(
      map(getAggregator(reducer)),

      // while init is not finished (old events replaying), we expect reducers to
      // catch all events, but we don't want any new state emited (it's not new states, it's old state re-reduced)
      skipUntil(initDone$),
      distinctUntilChanged()
    )

  const store = {
    addRootReducer: reducer => {
      replayCaster.subscribe(getAggregator(reducer))

      return store
    },

    addEffect: effectWithReducersSubscriber => {
      const effectSubscriber = effectEventSource => {
        const afterInitEventSource = effectEventSource.pipe(skipUntil(initDone$))

        return effectWithReducersSubscriber(afterInitEventSource, pipeReducer)
      }

      branches.push(effect(effectSubscriber))

      return store
    },

    init: () => {
      if (!branches.length) {
        throw new Error('No effect defined. This is useless')
      }

      return eventSource
        .pipe(
          tap(replayCaster),
          parallelMerge(...branches),
          startWith({ type: INITIAL_EVENT_TYPE, payload: initialPayload })
        )
        .subscribe(eventSource).unsubscribe
    }
  }

  return store
}
