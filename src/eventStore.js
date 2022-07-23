import { ReplaySubject, Subject } from 'rxjs'
import { filter, share, skipUntil, take, takeUntil } from 'rxjs/operators'

import { chain } from './lib/function/chain'
import { pipe } from './lib/function/pipe'
import { simpleUnsub } from './lib/rx/simpleUnsub'
import { isCommand } from './lib/event/isValidEvent'

import { createExtensibleEventSubject } from './extensibleEventSubject'
import { createProjectionWrapperFactory } from './projectionWrapper'
import { commandRunner } from './commandRunner'
import { parseStoreArgs } from './parseStoreArgs'

export const createStore = pipe(parseStoreArgs, (options) => {
  const {
    eventSubject,
    addLogger,
    addSource,
    addEventEnhancer,
    addPastEventEnhancer,
    disableAddSource,
    isFirstEvent,
  } = createExtensibleEventSubject()

  const addAllEventsEnhancer = (enhancer) => {
    const removePastEventEnhancer = addPastEventEnhancer(enhancer)
    const removeEventEnhancer = addEventEnhancer(enhancer)

    return () => {
      removePastEventEnhancer()
      removeEventEnhancer()
    }
  }

  if (options.eventEnhancer) {
    addAllEventsEnhancer(options.eventEnhancer)
  }

  // Use subjects to have single subscription points to connect all together (one for input, one for output)
  // eventCaster will handle events coming from eventSubject to aggregators and effects
  const eventCaster = new Subject()
  // eventCatcher will handle events coming from effects to eventSubject
  const eventCatcher = new Subject()

  const initDone = eventCaster.pipe(
    filter(isFirstEvent),
    take(1),
    share({
      connector: () => new ReplaySubject(1),
      resetOnRefCountZero: false,
      resetOnComplete: false,
      resetOnError: true,
    }),
  )

  const withProjection = createProjectionWrapperFactory(
    eventCaster.pipe(
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false,
        resetOnComplete: true,
        resetOnError: true,
      }),
    ),
    initDone,
    options.aggregatorFactory,
  )

  const pastEvent$ = eventCaster.pipe(takeUntil(initDone))

  const event$ = eventCaster.pipe(skipUntil(initDone))

  const dispatch = (event) => {
    if (isCommand(event)) {
      const { command, executionPromise } = commandRunner(event, effectAPI)

      eventCatcher.next(command)
      return executionPromise
    }

    // TODO: add a comment here explaining why we need this resolved promise here
    return Promise.resolve(eventCatcher.next(event))
  }

  const effectAPI = {
    addEffect: (effect) =>
      simpleUnsub(
        effect({
          // destructuring here prevents mutations on effectAPI from effect
          ...effectAPI,
        }),
      ),
    addSource,
    addLogger,
    addEventEnhancer,
    addPastEventEnhancer,
    addAllEventsEnhancer,
    pastEvent$,
    event$,
    dispatch,
    withProjection,
  }

  const initDoneSubscription = initDone.subscribe(disableAddSource)

  // EventCatcher must be connected to eventSubject before effects
  // are added, to be ready to catch all events
  const eventCatcherSubscription = eventCatcher.subscribe(eventSubject)

  // connect each defined effect and buid a disconnect function that disconnect all effects
  const removeEffects = chain(...options.effects.map(effectAPI.addEffect))

  const handleError =
    options.errorHandler ||
    ((error) => {
      throw error
    })

  // Once everything is pieced together, subscribe it to event source to start the process
  const eventCasterSubscription = eventSubject.subscribe(
    (value) => eventCaster.next(value),
    (error) => {
      destroyStore()
      handleError(error)
    },
    () => destroyStore(),
  )

  const destroyStore = chain(
    simpleUnsub(initDoneSubscription),
    simpleUnsub(eventCatcherSubscription),
    simpleUnsub(eventCasterSubscription),
    () => eventCaster.complete(),
    removeEffects,
  )

  return {
    destroyStore,
    addEffect: effectAPI.addEffect,
  }
})
