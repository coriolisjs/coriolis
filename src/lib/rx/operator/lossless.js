import { Observable } from 'rxjs'

export const lossless = source => {
  const buffer = []
  let error
  let completed = false
  let bufferSubscription
  let subscriptionsCount = 0

  const bufferize = () => {
    bufferSubscription = source.subscribe(
      event => buffer.push(event),
      err => { error = err },
      _ => { completed = true }
    )
  }

  bufferize()

  return Observable.create(observer => {
    let subscription

    buffer.forEach(event => observer.next(event))

    if (error) {
      observer.error(error)
    } else if (completed) {
      observer.complete()
    } else {
      subscription = source.subscribe(observer)
      subscriptionsCount += 1
    }

    if (bufferSubscription) {
      bufferSubscription.unsubscribe()

      // flushes initial subscription
      bufferSubscription = undefined
      // flushes events buffer
      buffer.length = 0
      error = undefined
      completed = false
    }

    return () => {
      if (!subscription) {
        return
      }

      subscription.unsubscribe()
      subscription = undefined
      subscriptionsCount -= 1

      if (subscriptionsCount === 0) {
        bufferize()
      }
    }
  })
}
