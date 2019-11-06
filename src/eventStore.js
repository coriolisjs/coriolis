import {
  Subject,
  from,
  noop
} from 'rxjs'
import {
  filter,
  shareReplay,
  skipUntil,
  take,
  takeUntil,
  endWith
} from 'rxjs/operators'

import { createEventSource } from './eventSource'
import { createAggregatorFactory } from './aggregator'
import { createAggrWrapperFactory } from './aggrWrapper'

import { createBroadcastSubject } from './lib/rx/broadcastSubject'
import { createExtensibleObservable } from './lib/rx/extensibleObservable'
import { variableFunction } from './lib/function/variableFunction'
import { simpleUnsub } from './lib/rx/simpleUnsub'
import { payloadEquals } from './lib/event/payloadEquals'

export const FIRST_EVENT_TYPE = 'All initial events have been read'

const buildFirstEvent = () => ({
  type: FIRST_EVENT_TYPE,
  payload: {}
})

export const createStore = (_options, ...rest) => {
  let options = _options
  let effects
  if (typeof options === 'function') {
    effects = [options, ...rest]
    options = {}
  } else if (options.effects && Array.isArray(options.effects)) {
    effects = [...options.effects, ...rest]
  } else {
    effects = rest
  }

  if (!effects.length) {
    throw new Error('No effect defined. This app is useless, let\'s stop right now')
  }

  const firstEvent = buildFirstEvent()

  // Use subjects to have single subscription points to connect all together (one for input, one for output)
  // eventCaster will handle events coming from eventSource to aggregators and effects
  const eventCaster = new Subject()
  // eventCatcher will handle events coming from effects to eventSource
  const eventCatcher = new Subject()

  // replayCaster is the same as eventCaster but always replaying last event
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
  const eventSource = createEventSource(
    mainSource.pipe(endWith(firstEvent)),
    logger,
    options.eventEnhancer
  )

  const initDone = eventCaster.pipe(
    // Check is done on payload value, event object itself
    // would have been changed (adding meta-data for example)
    filter(payloadEquals(firstEvent.payload)),
    take(1),
    shareReplay(1)
  )

  const aggregatorFactory = options.aggregatorFactory || createAggregatorFactory()

  const {
    get: withAggr
  } = createAggrWrapperFactory(replayCaster, initDone, aggregatorFactory.get)

  const initialEvent$ = eventCaster.pipe(takeUntil(initDone))

  const effectEventSource = Subject.create(
    eventCatcher,
    eventCaster.pipe(skipUntil(initDone))
  )

  const addEffect = effect => simpleUnsub(effect({
    addEffect,
    addSource,
    addLogger,
    initialEvent$,
    eventSource: effectEventSource,
    withAggr
  }))

  const initDoneSubscription = initDone.subscribe(disableAddSource)

  // EventCatcher must be connected to eventSource before effects
  // are added, to be ready to catch all events
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
