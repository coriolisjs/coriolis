import {
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
import { createReducerAggregator } from './reducerAggregator'
import { createAggregator } from './aggregator'
import { createBroadcastSubject } from './broadcastSubject'

import { createExtensibleObservable } from './lib/rx/extensibleObservable'
import { createIndex } from './lib/objectIndex'
import { createFuse } from './lib/function/createFuse'

export const INITIAL_EVENT_TYPE = Symbol('INITIAL_EVENT')

const payloadEquals = payload => event => event.payload === payload

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
  const getReducer = createIndex(reducer => createReducerAggregator(reducer))
  const getAggregator = createIndex(aggr => createAggregator(aggr, getAggregator, getReducer))

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
    broadcastSubject: logger,
    addTarget: addLogger
  } = createBroadcastSubject()

  const {
    observable: mainSource,
    addSource,
    disableAddSource
  } = createExtensibleFusableObservable('addSource must be called before all sources completed')

  const eventSource = createEventSource(mainSource, logger)

  const initIndexed = getIndexed => aggr =>
    replayCaster.subscribe(getIndexed(aggr))

  const pipeIndexed = getIndexed => obj =>
    replayCaster.pipe(
      map(getIndexed(obj)),

      // while init is not finished (old events replaying), we expect aggrs to
      // catch all events, but we don't want any new state emited (it's not new states, it's old state reaggregated)
      skipUntil(initDone),

      // if event does not lead to a new aggregate, we don't want to emit
      distinctUntilChanged()
    )

  const initAggr = initIndexed(getAggregator)
  const initReducer = initIndexed(getReducer)

  const pipeAggr = pipeIndexed(getAggregator)
  const pipeReducer = pipeIndexed(getReducer)

  const addEffect = effect => {
    const removeEffect = effect({
      initialEvent$,
      eventSource: effectEventSource,
      pipeAggr,
      initAggr,
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
