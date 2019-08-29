const { Observable } = require('rxjs')

const createEffectOperator = subject => source =>
  Observable.create(observer => {
    const outSubscription = subject.subscribe(observer)
    const inSubscription = source.subscribe(subject)

    return () => {
      inSubscription.unsubscribe()
      outSubscription.unsubscribe()
    }
  })

module.exports = {
  effect: createEffectOperator
}
