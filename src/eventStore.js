import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
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

export const createStore = (...effects) => {
  if (!effects.length) {
    throw new Error('No effect defined. This is useless')
  }

  const {
    observable: mainSource,
    add: _addSource
  } = createExtensibleObservable()

  const {
    observable: loggersOutput2,
    add: addLoggerOutput
  } = createExtensibleObservable()

  const loggersInput = new Subject()
  const loggersOutput = new Subject()

  const mainLogger = Subject.create(loggersInput, loggersOutput)

  const eventSource = createEventSource(mainSource, mainLogger)

  const replayCaster = new ReplaySubject(1)

  const getAggregator = createIndex(createAggregator)

  const initialPayload = {}

  const initDone = replayCaster.pipe(
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
      skipUntil(initDone),

      // if event does not lead to a new aggregate, we don't want to emit
      distinctUntilChanged()
    )

  const addLogger = logger => {
    const subscription = loggersInput.subscribe(logger)

    if (logger instanceof Observable) {
      const removeLoggerOutput = addLoggerOutput(logger)

      return () => {
        subscription.unsubscribe()
        removeLoggerOutput()
      }
    }

    return () => subscription.unsubscribe()
  }

  const {
    pass: addSource,
    cut: disableAddSource
  } = createFuse(
    source => _addSource(from(source)),
    () => { throw new Error('addSource must be called before all sources completed') }
  )

  const disableAddSourceSubscription = initDone.subscribe(disableAddSource)

  const setupEffects = source =>
    Observable.create(observer => {
      const eventCaster = new Subject()
      const afterInitEventSource = Subject.create(
        observer,
        eventCaster.pipe(skipUntil(initDone))
      )

      const initialEvent$ = eventCaster.pipe(takeUntil(initDone))

      const addEffect = effect => {
        const removeEffect = effect({
          initialEvent$,
          eventSource: afterInitEventSource,
          pipeReducer,
          initReducer,
          addSource,
          addLogger,
          addEffect
        }) || noop

        return removeEffect.unsubscribe ?
          () => removeEffect.unsubscribe()
          : removeEffect
      }

      const removeEffects = effects
        .map(addEffect)
        .reduce(
          (prev, removeEffect) => () => { prev(); removeEffect() },
          noop
        )

      const sourceSubscription = source.subscribe(eventCaster)

      return () => {
        sourceSubscription.unsubscribe()
        removeEffects()
      }
    })

  const storeSubscription = eventSource
    .pipe(
      tap(replayCaster),
      setupEffects,
      startWith({ type: INITIAL_EVENT_TYPE, payload: initialPayload })
    )
    .subscribe(eventSource)

  return () => {
    storeSubscription.unsubscribe()
    disableAddSourceSubscription.unsubscribe()
  }
}
