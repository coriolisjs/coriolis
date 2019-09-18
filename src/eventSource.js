import { Subject, merge, noop, EMPTY } from 'rxjs'
import {
  concat,
  map,
  share,
  tap
} from 'rxjs/operators'

import { lossless } from './lib/rx/operator/lossless'
import { throwFalsy } from './lib/function/throwFalsy'
import { uniqSymbol } from './lib/symbol/uniqSymbol'
import { isValidEvent } from './lib/event/isValidEvent'

/*
Adding a uniq property in every event's metadata, we can ensure each events enters only once
*/
const preventLoops = (secretKey = uniqSymbol()) => event => {
  if (event.meta && event.meta[secretKey]) {
    throw new Error('Event coming back to source detected')
  }

  return {
    ...event,
    meta: Object.defineProperty({ ...event.meta }, secretKey, {
      configurable: false,
      enumerable: false,
      writable: false,
      value: true
    })
  }
}

export const createEventSource = (initialSource = EMPTY, logObserver = noop) => {
  let newevent$
  const neweventSubject = newevent$ = new Subject()

  // log observer could be a Subject that emits events about log process (write error, log rotate events...)
  if (logObserver && logObserver instanceof Subject) {
    newevent$ = merge(neweventSubject, logObserver)
  }

  const startoverNewevent$ = newevent$
    .pipe(
      tap(throwFalsy(isValidEvent, new TypeError('Invalid event'))),
      map(preventLoops()),
      lossless,
      tap(logObserver)
    )

  const event$ = initialSource
    .pipe(
      concat(startoverNewevent$),
      share()
    )

  return Subject.create(neweventSubject, event$)
}
