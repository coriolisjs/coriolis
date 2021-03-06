import { Observable, Subject } from 'rxjs'

export const createExtensibleOperator = () => {
  let operators = []
  let updators = []

  const operator = (source) =>
    Observable.create((observer) => {
      const inputSubject = new Subject()
      let observerSubscription

      const updateOperators = () => {
        if (observerSubscription) {
          observerSubscription.unsubscribe()
        }

        observerSubscription = inputSubject.pipe(...operators).subscribe({
          next: (arg) => observer.next(arg),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        })
      }

      updateOperators()
      updators.push(updateOperators)

      const sourceSubscription = source.subscribe({
        next: (arg) => inputSubject.next(arg),
        error: (error) => inputSubject.error(error),
        complete: () => inputSubject.complete(),
      })

      return () => {
        updators = updators.filter((updator) => updator !== updateOperators)
        sourceSubscription.unsubscribe()
        observerSubscription.unsubscribe()
      }
    })

  const add = (newOperator) => {
    operators.push(newOperator)
    updators.forEach((updator) => updator())

    return () => {
      operators = operators.filter((operator) => operator !== newOperator)
      updators.forEach((updator) => updator())
    }
  }

  return {
    operator,
    add,
  }
}
