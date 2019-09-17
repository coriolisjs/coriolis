import {
  Observable,
  ReplaySubject,
  Subject,
  from,
  noop,
  identity
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

const createAggregator = (aggr, getAggregator, getReducer) => {
  if (typeof aggr !== 'function') {
    throw new TypeError('Aggr must be a function')
  }

  let lastEvent
  let lastState
  let lastValues = []

  const using = {
    aggr: []
  }

  const getLastState = () => lastState

  const useState = () => {
    using.state = true
    using.aggr.push(getLastState)
  }

  const useEvent = () => {
    using.event = true
    using.aggr.push(identity)
  }

  const useIndexed = getIndexed => obj =>
    using.aggr.push(getIndexed(obj))

  const useAggr = useIndexed(getAggregator)
  const useReducer = useIndexed(getReducer)

  const aggrBehaviour = aggr({
    useState,
    useEvent,
    useAggr,
    useReducer
  })

  // if given aggregator definition expects only state and event (or less), it should be a reducer
  if (getReducer && using.aggr.length === (using.state + using.event)) {
    console.warn('Prefer using initReducer, pipeReducer or useReducer when you only use state or event')
    if (
      (!using.aggr[0] || using.aggr[0] === getLastState) &&
      (!using.aggr[1] || using.aggr[1] === identity)
    ) {
      return getReducer(aggrBehaviour)
    }
  }

  return event => {
    // in any case, same event > same result
    if (lastEvent && event === lastEvent.value) {
      return lastState
    }

    lastEvent = { value: event }

    const values = using.aggr.map(aggr => aggr(event))

    const anyChange = using.event || values.some((item, idx) => item !== lastValues[idx])

    if (!anyChange) {
      return lastState
    }

    lastValues = values

    lastState = aggrBehaviour(...values)

    return lastState
  }
}

const createReducerAggregator = reducer => createAggregator(({ useState, useEvent }) => (
  useState(),
  useEvent(),
  reducer
))

const payloadEquals = payload => event => event.payload === payload

const createLogMerger = () => {
  const loggersInput = new Subject()
  const loggersOutput = new Subject()

  const mainLogger = Subject.create(loggersInput, loggersOutput)

  const addLogger = logger => {
    const subscription = loggersInput.subscribe(logger)

    if (logger instanceof Observable) {
      const loggerOutputSubscription = logger.subscribe(
        // TODO: using event builders here would be better
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
    logger,
    addLogger
  } = createLogMerger()

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
