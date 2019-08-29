import { Observable } from 'rxjs'

export const createEffectOperator = subject => source =>
  Observable.create(observer => {
    const outSubscription = subject.subscribe(observer)
    const inSubscription = source.subscribe(subject)

    return () => {
      inSubscription.unsubscribe()
      outSubscription.unsubscribe()
    }
  })

export {
  createEffectOperator as effect
}
