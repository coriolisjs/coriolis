import {
  Observable,
  ReplaySubject,
  Subject,
  from,
  noop
} from 'rxjs'
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  skipUntil,
  startWith,
  take,
  takeUntil,
  tap
} from 'rxjs/operators'

import { createEventSource } from './eventSource'

import { createExtensibleObservable } from './lib/rx/extensibleObservable'

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

const createLogMerger = () => {
  const loggersInput = new Subject()
  const loggersOutput = new Subject()

  const mainLogger = Subject.create(loggersInput, loggersOutput)

  const addLogger = logger => {
    const subscription = loggersInput.subscribe(logger)

    if (logger instanceof Observable) {
      const loggerOutputSubscription = logger.subscribe(
        payload => loggersOutput.next({ type: 'logger output', payload }),
        error => loggersOutput.next({ type: 'logger output error', payload: error, error: true }),
        () => loggersOutput.next({ type: 'logger output completed' })
      )

      return () => {
        subscription.unsubscribe()
        loggerOutputSubscription.unsubscribe()
      }
    }

    return () => subscription.unsubscribe()
  }

  return {
    logger: mainLogger,
    addLogger
  }
}

const createExtensibleFusableObservable = cutMessage => {
  const {
    observable,
    add
  } = createExtensibleObservable()

  const {
    pass: addSource,
    cut: disableAddSource
  } = createFuse(
    source => add(from(source)),
    () => { throw new Error(cutMessage) }
  )

  return {
    observable,
    addSource,
    disableAddSource
  }
}

export const createStore = (...effects) => {
  if (!effects.length) {
    throw new Error('No effect defined. This is useless')
  }

  const initialPayload = {}
  const getAggregator = createIndex(createAggregator)

  const eventCaster = new Subject()
  const replayCaster = new ReplaySubject(1)
  const eventCatcher = new Subject()

  const initDone = replayCaster.pipe(
    filter(payloadEquals(initialPayload)),
    take(1),
    shareReplay(1)
  )

  const effectEventSource = Subject.create(
    eventCatcher,
    eventCaster.pipe(skipUntil(initDone))
  )

  const initialEvent$ = eventCaster.pipe(takeUntil(initDone))

  const {
    logger,
    addLogger
  } = createLogMerger()

  const {
    observable: mainSource,
    addSource,
    disableAddSource
  } = createExtensibleFusableObservable('addSource must be called before all sources completed')

  const eventSource = createEventSource(mainSource, logger)

  const initReducer = reducer =>
    replayCaster.subscribe(getAggregator(reducer))

  const pipeReducer = reducer =>
    replayCaster.pipe(
      map(getAggregator(reducer)),

      // while init is not finished (old events replaying), we expect reducers to
      // catch all events, but we don't want any new state emited (it's not new states, it's old state re-reduced)
      skipUntil(initDone),

      // if event does not lead to a new aggregate, we don't want to emit
      distinctUntilChanged()
    )

  const addEffect = effect => {
    const removeEffect = effect({
      initialEvent$,
      eventSource: effectEventSource,
      pipeReducer,
      initReducer,
      addSource,
      addLogger,
      addEffect
    }) || noop

    return removeEffect.unsubscribe
      ? () => removeEffect.unsubscribe()
      : removeEffect
  }

  const disableAddSourceSubscription = initDone.subscribe(disableAddSource)

  const eventCatcherSubscription = eventCatcher
    .pipe(
      startWith({ type: INITIAL_EVENT_TYPE, payload: initialPayload })
    )
    .subscribe(eventSource)

  const removeEffects = effects
    .map(addEffect)
    .reduce(
      (prev, removeEffect) => () => { prev(); removeEffect() },
      noop
    )

  const eventCasterSubscription = eventSource
    .pipe(
      tap(replayCaster)
    )
    .subscribe(eventCaster)

  return () => {
    disableAddSourceSubscription.unsubscribe()
    eventCatcherSubscription.unsubscribe()
    eventCasterSubscription.unsubscribe()
    removeEffects()
  }
}
