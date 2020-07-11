import { Subject, of } from 'rxjs'
import {
  filter,
  shareReplay,
  skipUntil,
  take,
  takeUntil,
  mergeMap,
} from 'rxjs/operators'

import { simpleUnsub } from './lib/rx/simpleUnsub'
import { asObservable } from './lib/rx/asObservable'
import { promiseObservable } from './lib/rx/promiseObservable'
import { payloadEquals } from './lib/event/payloadEquals'
import { isCommand } from './lib/event/isValidEvent'
import { noop } from './lib/function/noop'

import { createExtensibleEventSubject } from './extensibleEventSubject'
import { createProjectionWrapperFactory } from './projectionWrapper'

export const withSimpleStoreSignature = (callback) => (_options, ...rest) => {
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

  return callback(options, ...effects)
}

export const createStore = withSimpleStoreSignature((options, ...effects) => {
  if (!effects.length) {
    throw new Error(
      "No effect defined. This app is useless, let's stop right now",
    )
  }

  const {
    eventSubject,
    addLogger,
    addSource,
    disableAddSource,
    firstEvent,
  } = createExtensibleEventSubject(options.eventEnhancer)

  // Use subjects to have single subscription points to connect all together (one for input, one for output)
  // eventCaster will handle events coming from eventSubject to aggregators and effects
  const eventCaster = new Subject()
  // eventCatcher will handle events coming from effects to eventSubject
  const eventCatcher = new Subject()

  const initDone = eventCaster.pipe(
    // Check is done on payload value, event object itself
    // would have been changed (adding meta-data for example)
    filter(payloadEquals(firstEvent.payload)),
    take(1),
    shareReplay(1),
  )

  const withProjection = createProjectionWrapperFactory(
    eventCaster.pipe(shareReplay(1)),
    initDone,
    options.aggregatorFactory,
  )

  const pastEvent$ = eventCaster.pipe(takeUntil(initDone))

  const event$ = eventCaster.pipe(skipUntil(initDone))

  const commandRunner = (command, removeSubject) => () =>
    asObservable(
      command({
        // FIXME: How one would remove an effect added this way ?
        addEffect: (effect) => {
          const removeEffect = addEffect(effect)

          removeSubject.next(removeEffect)

          return removeEffect
        },
        getProjectionValue: (projection) =>
          withProjection(projection).getValue(),
      }),
    ).pipe(
      mergeMap((event) =>
        isCommand(event) ? commandRunner(event, removeSubject)() : of(event),
      ),
    )

  const dispatch = (event) => {
    if (isCommand(event)) {
      const removeSubject = new Subject()
      const { execute: command, executionPromise } = promiseObservable(
        commandRunner(event, removeSubject),
      )

      eventCatcher.next(command)
      return executionPromise.then(() => removeSubject)
    }

    return eventCatcher.next(event)
  }

  const addEffect = (effect) =>
    simpleUnsub(
      effect({
        addEffect,
        addSource,
        addLogger,
        pastEvent$,
        event$,
        dispatch,
        withProjection,
      }),
    )

  const initDoneSubscription = initDone.subscribe(disableAddSource)

  // EventCatcher must be connected to eventSubject before effects
  // are added, to be ready to catch all events
  const eventCatcherSubscription = eventCatcher.subscribe(eventSubject)

  // connect each defined effect and buid a disconnect function that disconnect all effects
  const removeEffects = effects
    .map(addEffect)
    .reduce((prev, removeEffect) => () => (prev(), removeEffect()), noop)

  // Once everything is pieced together, subscribe it to event source to start the process
  const eventCasterSubscription = eventSubject.subscribe(eventCaster)

  return () => {
    initDoneSubscription.unsubscribe()
    eventCatcherSubscription.unsubscribe()
    eventCasterSubscription.unsubscribe()
    removeEffects()
  }
})
