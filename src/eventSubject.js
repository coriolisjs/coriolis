import { Subject, merge, noop, identity, EMPTY, of } from 'rxjs'
import { concat, map, tap, mergeMap } from 'rxjs/operators'

import { lossless } from './lib/rx/operator/lossless'
import { throwFalsy } from './lib/function/throwFalsy'
import { isValidEvent, isCommand } from './lib/event/isValidEvent'
import { stampEvent } from './lib/event/stampEvent'
import { preventEventLoops } from './lib/event/preventEventLoops'

/*
eventSubject behaviour:
  Immediatly every input event is kept in a buffer until input events subscription
  then subscribes to log subject's output if any, taking this as input events

  On eventSubject subscription, subscribes pastSource
  When pastSource completes, subscribes to input events (flushes buffer, then gets new events)

  Share's subscriptions to ensure upstream subscriptions are done only once
*/
export const createEventSubject = (
  pastSource = EMPTY,
  logObserver = noop,
  eventEnhancer = identity,
) => {
  let newevent$
  const neweventSubject = (newevent$ = new Subject())

  // log observer could be a Subject that emits events about
  // log process (write error, log rotate events...)
  if (logObserver && logObserver instanceof Subject) {
    newevent$ = merge(neweventSubject, logObserver)
  }

  const startoverNewevent$ = newevent$.pipe(
    lossless,

    // commands are functions returning an observable of events
    // those events will be sent on newevent$ so they gets through the complet event handling process
    // command execution must be done after lossless bufferisation to keep chronology
    mergeMap((event) => (isCommand(event) ? event() : of(event))),

    // Ensuring event's shape helps keeping control
    tap(throwFalsy(isValidEvent, new TypeError('Invalid event'))),
    map(preventEventLoops()),

    // stampEvent and eventEnhancer are both included after lossless operator
    // to ensure it executes after all past events are done
    map(stampEvent),
    eventEnhancer,

    // events are logged after every enhancement
    tap(logObserver),
  )

  const event$ = pastSource.pipe(
    // in case an past events source provides not-timestamped events, we add
    // a timestamp here to be sure every event have one
    map(stampEvent),
    eventEnhancer,
    concat(startoverNewevent$),
  )

  return Subject.create(neweventSubject, event$)
}
