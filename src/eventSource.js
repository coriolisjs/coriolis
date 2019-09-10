import { Subject, from, merge, noop, EMPTY } from 'rxjs'
import {
  concat,
  map,
  share,
  tap
} from 'rxjs/operators'

import { lossless } from './lib/rx/operator/lossless'
import { hasOnlyKeys } from './lib/object/hasOnlyKeys'

const unicityWarrentKey = Symbol(Math.random().toString(36).substring(2, 15))

const isValidEvent = event =>
  event &&
  event.type &&
  hasOnlyKeys(event, ['type', 'payload', 'error', 'meta']) &&
  (event.error === undefined || typeof event.error === 'boolean') &&
  (event.meta === undefined || typeof event.meta === 'object')

const throwInvalide = event => {
  if (!isValidEvent(event)) {
    throw new TypeError('Invalid event')
  }
}

const preventLoops = event => {
  if (event.meta && event.meta[unicityWarrentKey]) {
    throw new Error('Event coming back to source detected')
  }

  return {
    ...event,
    meta: Object.defineProperty({ ...event.meta }, unicityWarrentKey, {
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
      tap(throwInvalide),
      map(preventLoops),
      lossless,
      tap(logObserver)
    )

  const event$ = from(initialSource)
    .pipe(
      concat(startoverNewevent$),
      share()
    )

  return Subject.create(neweventSubject, event$)
}
