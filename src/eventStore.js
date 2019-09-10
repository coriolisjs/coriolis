import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  from,
  merge
} from 'rxjs'
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  skipUntil,
  startWith,
  take,
  tap
} from 'rxjs/operators'

import { createEventSource } from './eventSource'

import { parallelMerge } from './lib/rx/operator/parallel'
import { effect } from './lib/rx/operator/effect'

import { createIndex } from './lib/objectIndex'
import { createFuse } from './lib/function/createFuse'

const INITIAL_EVENT_TYPE = 'INITIAL_EVENT'

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

const payloadEquals = payload => event => event.payload === payload

// TODO: Convert this builder pattern to a single subscribe pattern to avoid questions about multiple calls to init and so
export const createStore = (...effects) => {
  if (!effects.length) {
    throw new Error('No effect defined. This is useless')
  }

  let sources = []
  const mainSource = Observable.create(observer => {
    return merge(...sources).subscribe(observer)
  })

  const loggersOutput = new Subject()
  const loggersInput = new Subject()

  const mainLogger = Subject.create(loggersInput, loggersOutput)

  const eventSource = createEventSource(mainSource, mainLogger)

  const replayCaster = new ReplaySubject(1)

  const getAggregator = createIndex(createAggregator)

  const initialPayload = {}

  const initDone$ = replayCaster.pipe(
    filter(payloadEquals(initialPayload)),
    take(1),
    shareReplay(1)
  )

  const initReducer = reducer =>
    replayCaster.subscribe(getAggregator(reducer))

  const pipeReducer = reducer =>
    replayCaster.pipe(
      map(getAggregator(reducer)),

      // while init is not finished (old events replaying), we expect reducers to
      // catch all events, but we don't want any new state emited (it's not new states, it's old state re-reduced)
      skipUntil(initDone$),
      distinctUntilChanged()
    )

  const pipeLogger = logger => {
    const subscription = loggersInput.subscribe(logger)

    if (logger instanceof Subject) {
      return subscription.add(logger.subscribe(loggersOutput))
    }

    return subscription
  }

  const pipeSource = source => {
    const source$ = from(source)

    sources.push(source$)

    return new Subscription(() => {
      sources = sources.filter(src => src !== source$)
    })
  }

  const setupEffect = effectWithReducersSubscriber => {
    const effectSubscriber = effectEventSource => {
      // event source emitting only after init finished, to avoid casting past events into effects
      const afterInitEventSource = Subject.create(
        effectEventSource,
        effectEventSource.pipe(skipUntil(initDone$))
      )

      const {
        pass: fusablePipeSource,
        cut
      } = createFuse(pipeSource, () => { throw new Error('pipeSource must be called synchronously or never') })

      const subscription = effectWithReducersSubscriber({
        eventSource: afterInitEventSource,
        pipeReducer,
        pipeSource: fusablePipeSource,
        pipeLogger,
        initReducer
      })

      cut()

      return subscription
    }

    return effect(effectSubscriber)
  }

  return eventSource
    .pipe(
      tap(replayCaster),
      parallelMerge(...effects.map(setupEffect)),
      startWith({ type: INITIAL_EVENT_TYPE, payload: initialPayload })
    )
    .subscribe(eventSource)
}
