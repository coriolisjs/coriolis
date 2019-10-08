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
  take,
  takeUntil,
  endWith
} from 'rxjs/operators'

import { createEventSource } from './eventSource'
import { createAggregator } from './aggregator'

import { createBroadcastSubject } from './lib/rx/broadcastSubject'
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
    throw new Error('No effect defined. This app is useless, let\'s stop right now')
  }

  const {
    get: getAggregator,
    list: listAggregators,
    flush: flushAggr
  } = createIndex(aggr => createAggregator(aggr, getAggregator))

  // to build a snapshot, we get the current state from each aggregator and put
  // all this in an object, using aggregator definition's name as keys. If any conflicts
  // on names, numbers are concatenated on conflicting keys (aKey, aKey-2, aKey-3...)
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
    add: addSourceToMainSource
  } = createExtensibleObservable()

  const {
    func: addSource,
    setup: setupAddSource
  } = variableFunction(source => addSourceToMainSource(from(source)))

  const disableAddSource = () => setupAddSource(() => {
    throw new Error('addSource must be called before all sources completed')
  })

  // From the moment this event source is created, it starts buffering all events it receives
  // until it gets a subscription and passes them
  const eventSource = createEventSource(mainSource.pipe(endWith(firstEvent)), logger)

  const initDone = eventCaster.pipe(
    // Check is done on payload value, event object itself would have been changed (adding meta-data for example)
    filter(payloadEquals(firstEvent.payload)),
    take(1),
    shareReplay(1)
  )

  const initialEvent$ = eventCaster.pipe(takeUntil(initDone))

  const effectEventSource = Subject.create(
    eventCatcher,
    eventCaster.pipe(skipUntil(initDone))
  )

  const connectAggr = aggr => {
    const subscription = replayCaster.subscribe(getAggregator(aggr))

    // We don't return directly subscription because user is not aware it's an observable under the hood
    // For user, the request is to connect an aggregator, it should return a function to disconnect it
    return () => subscription.unsubscribe()
  }

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
      connectAggr,
      flushAggr,
      pipeAggr,
      getSnapshot
    }) || noop

    return removeEffect.unsubscribe
      ? () => removeEffect.unsubscribe()
      : removeEffect
  }

  const initDoneSubscription = initDone.subscribe(disableAddSource)

  // EventCatcher must be connected to eventSource before effects are added, to be ready to catch all events
  const eventCatcherSubscription = eventCatcher
    .subscribe(eventSource)

  // connect each defined effect and buid a disconnect function that disconnect all effects
  const removeEffects = effects
    .map(addEffect)
    .reduce(
      (prev, removeEffect) => () => (prev(), removeEffect()),
      noop
    )

  // Once everything is pieced together, subscribe it to event source to start the process
  const eventCasterSubscription = eventSource
    .subscribe(eventCaster)

  return () => {
    initDoneSubscription.unsubscribe()
    eventCatcherSubscription.unsubscribe()
    eventCasterSubscription.unsubscribe()
    removeEffects()
  }
}
