import { concat, EMPTY, merge, of, Subject } from "rxjs";
import { map, mergeMap, tap } from "rxjs/operators";

import { isValidEvent } from "./lib/event/isValidEvent.js";
import { preventEventLoops } from "./lib/event/preventEventLoops.js";
import { stampEvent } from "./lib/event/stampEvent.js";
import { identity } from "./lib/function/identity.js";
import { noop } from "./lib/function/noop.js";
import { throwFalsy } from "./lib/function/throwFalsy.js";
import { lossless } from "./lib/rx/operator/lossless.js";

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
  pastEventEnhancer = identity,
  eventMiddleware = (event) => of(event),
) => {
  let newevent$;
  const neweventSubject = (newevent$ = new Subject());

  // log observer could be a Subject that emits events about
  // log process (write error, log rotate events...)
  if (logObserver && logObserver instanceof Subject) {
    newevent$ = merge(neweventSubject, logObserver);
  }

  const startoverNewevent$ = newevent$.pipe(
    lossless,
    // eventMiddleware is a function returning an observable of events
    // it must be piped after lossless bufferisation
    mergeMap(eventMiddleware),
    // Ensuring event's shape helps keeping control
    tap(throwFalsy(isValidEvent, new TypeError("Invalid event"))),
    map(preventEventLoops()),
    // stampEvent and eventEnhancer are both included after lossless operator
    // to ensure it executes after all past events are done
    map(stampEvent),
    eventEnhancer,
    // events are logged after every enhancement
    tap(logObserver),
  );

  const event$ = concat(
    pastSource.pipe(
      // in case a past events source provides not-timestamped events, we add
      // a timestamp here to be sure every event has one
      map(stampEvent),
      pastEventEnhancer,
    ),
    startoverNewevent$,
  );

  return Subject.create(neweventSubject, event$);
};
