import { Observable, Subject } from 'rxjs'

const createEffectOperatorFromSubscriber = effectSubscriber => source =>
  Observable.create(observer => {
    // fusible is used to handle all effect subscriptions, and ensures those
    // subscriptions are not direct subscriptions to the source
    // Doing this ensures source subscriptions will be unsubscribed, even if all effect subscriptions are not unsubscribed
    // TODO: a warning could be displayed in case of effect subscriptions not unsubscribed
    const fusible = new Subject()

    return source.subscribe(fusible)
      .add(effectSubscriber(Subject.create(observer, fusible)))
  })

const createEffectOperatorFromSubject = subject => source =>
  Observable.create(observer =>
    subject.subscribe(observer).add(source.subscribe(subject))
  )

export const createEffectOperator = effectDefinition =>
  effectDefinition instanceof Subject
    ? createEffectOperatorFromSubject(effectDefinition)
    : createEffectOperatorFromSubscriber(effectDefinition)

export {
  createEffectOperator as effect
}
