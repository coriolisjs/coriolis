import { Observable, Subject, noop } from 'rxjs'

export const createExtensibleObservable = () => {
  let sources = []
  let sourceManagers = []

  const addSource = source => {
    sources.push(source)
    sourceManagers.forEach(({ add }) => add(source))

    return () => {
      sources = sources.filter(registered => registered !== source)
      sourceManagers.forEach(({ remove }) => remove(source))
    }
  }

  const observable = Observable.create(observer => {
    if (!sources.length) {
      observer.complete()
      return noop
    }

    const subject = new Subject()
    let subscriptions = []
    let subscriptionDone = false

    const remove = source => {
      subscriptions = subscriptions
        .filter(({ source: subscribedSource, subscription: sourceSubscription }) => {
          if (subscribedSource !== source) {
            return true
          }
          sourceSubscription.unsubscribe()
          return false
        })

      if (subscriptionDone && subscriptions.length === 0) {
        subject.complete()
      }
    }

    const add = source => {
      subscriptions.push({
        source,
        subscription: source.subscribe(
          event => subject.next(event),
          error => subject.error(error),
          () => remove(source)
        )
      })
    }

    const sourceManager = {
      add,
      remove
    }

    const subscription = subject.subscribe(observer)
    const unsubscribe = () => {
      subscription.unsubscribe()
      subscriptions.forEach(({ subscription: sourceSubscription }) => sourceSubscription.unsubscribe())
      sourceManagers = sourceManagers.filter(registered => registered !== sourceManager)
    }

    sourceManagers.push(sourceManager)

    sources.forEach(add)
    subscriptionDone = true

    if (subscriptions.length === 0) {
      // all subscriptions completed synchronously, set completed
      subject.complete()
    }

    return unsubscribe
  })

  return {
    observable,
    add: addSource
  }
}
