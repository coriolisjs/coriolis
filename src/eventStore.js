import {
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
  takeUntil
} from 'rxjs/operators'

import { createEventSource } from './eventSource'
import { createAggregator } from './aggregator'
import { createBroadcastSubject } from './broadcastSubject'

import { createExtensibleObservable } from './lib/rx/extensibleObservable'
import { variableFunction } from './lib/function/variableFunction'
import { createIndex } from './lib/objectIndex'
import { objectFrom } from './lib/object/objectFrom'
import { payloadEquals } from './lib/event/payloadEquals'

export const FIRST_EVENT_TYPE = 'All initial events have been read'

const buildFirstEvent = () => ({
  type: FIRST_EVENT_TYPE,
  payload: {}
})

export const createStore = (...effects) => {
  if (!effects.length) {
    throw new Error('No effect defined. This is useless')
  }

  const {
    get: getAggregator,
    list: listAggregators
  } = createIndex(aggr => createAggregator(aggr, getAggregator))

  const getSnapshot = () => objectFrom(
    listAggregators()
      .map(([ref, getState]) => [ref.name, getState()])
  )

  const firstEvent = buildFirstEvent()

  // Use a subject to have a single subscription point to connect all together
  const eventCaster = new Subject()
  const eventCatcher = new Subject()

  const replayCaster = eventCaster.pipe(shareReplay(1))

  const {
    broadcastSubject: logger,
    addTarget: addLogger
  } = createBroadcastSubject()

  const {
    observable: mainSource,
    add
  } = createExtensibleObservable()

  const {
    func: addSource,
    setup
  } = variableFunction(source => add(from(source)))

  const disableAddSource = () => setup(() => {
    throw new Error('addSource must be called before all sources completed')
  })

  const eventSource = createEventSource(mainSource, logger)

  const initDone = eventCaster.pipe(
    // checking payload, event itself could have been changed (adding meta-data for example)
    filter(payloadEquals(firstEvent.payload)),
    take(1),
    shareReplay(1)
  )

  const initDoneSubscription = initDone.subscribe(disableAddSource)

  const initialEvent$ = eventCaster.pipe(takeUntil(initDone))

  const effectEventSource = Subject.create(
    eventCatcher,
    eventCaster.pipe(skipUntil(initDone))
  )

  const initAggr = aggr =>
    replayCaster.subscribe(getAggregator(aggr))

  const pipeAggr = aggr =>
    replayCaster.pipe(
      map(getAggregator(aggr)),

      // while init is not finished (old events replaying), we expect aggrs to
      // catch all events, but we don't want any new state emited (it's not new states, it's old state reaggregated)
      skipUntil(initDone),

      // if event does not lead to a new aggregate, we don't want to emit
      distinctUntilChanged()
    )

  const addEffect = effect => {
    const removeEffect = effect({
      addEffect,
      addSource,
      addLogger,
      initialEvent$,
      eventSource: effectEventSource,
      initAggr,
      pipeAggr,
      getSnapshot
    }) || noop

    return removeEffect.unsubscribe
      ? () => removeEffect.unsubscribe()
      : removeEffect
  }

  const eventCatcherSubscription = eventCatcher
    .pipe(startWith(firstEvent))
    .subscribe(eventSource)

  const removeEffects = effects
    .map(addEffect)
    .reduce(
      (prev, removeEffect) => () => (prev(), removeEffect()),
      noop
    )

  const eventCasterSubscription = eventSource
    .subscribe(eventCaster)

  return () => {
    initDoneSubscription.unsubscribe()
    eventCatcherSubscription.unsubscribe()
    eventCasterSubscription.unsubscribe()
    removeEffects()
  }
}
