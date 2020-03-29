import { Observable } from 'rxjs'

export const ensureInitial = (getInitialValue) => (source) => {
  return Observable.create((observer) => {
    const finalNext = (event) => observer.next(event)
    const initialNext = (event) => {
      next = finalNext
      next(event)
    }
    let next = initialNext

    const subscription = source.subscribe(
      (event) => next(event),
      (error) => observer.error(error),
      () => observer.complete(),
    )

    if (next === initialNext) {
      next(getInitialValue())
    }

    return subscription
  })
}
