const { Subject, merge } = require('rxjs')
const {
  concat,
  map,
  share,
  tap
} = require('rxjs/operators')

const { lossless } = require('./lib/rx/operator/lossless')

const unicityWarrentKey = Symbol(Math.random().toString(36).substring(2, 15))

const remove = (obj, keys) => {
  const newObj = { ...obj }

  keys.forEach(key => delete newObj[key])

  return newObj
}

const isValidEvent = event =>
  event &&
  event.type &&
  !Object.keys(remove(event, ['type', 'payload', 'error', 'meta'])).length &&
  (event.error === undefined || typeof event.error === 'boolean') &&
  (event.meta === undefined || typeof event.meta === 'object')

const validate = event => {
  if (!isValidEvent(event)) {
    throw new TypeError('Invalid event')
  }

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

const createEventSource = (initialSource, logObserver) => {
  let newevent$
  const neweventSubject = newevent$ = new Subject()

  if (logObserver && logObserver instanceof Subject) {
    newevent$ = merge(neweventSubject, logObserver)
  }

  const startoverNewevent$ = newevent$
    .pipe(
      map(validate),
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

module.exports = {
  createEventSource
}
