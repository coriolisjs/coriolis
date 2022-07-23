import { Observable, Subject } from 'rxjs'

import { noop } from '../function/noop'

export const createBroadcastSubject = () => {
  const eventsEntry = new Subject()
  const feedbacksEntry = new Subject()

  const broadcastSubject = Subject.create(eventsEntry, feedbacksEntry)

  const addTarget = (target) => {
    const targetSubscription = eventsEntry.subscribe(
      typeof target !== 'function'
        ? target
        : {
            next: target,
            error: noop,
            complete: noop,
          },
    )

    if (target instanceof Observable) {
      // target's feedback completion should not complete feedback entry
      const targetFeedbackSubscription = target.subscribe(
        (payload) => feedbacksEntry.next(payload),
        (error) => feedbacksEntry.error(error),
      )

      return () => {
        targetSubscription.unsubscribe()
        targetFeedbackSubscription.unsubscribe()
      }
    }

    return () => targetSubscription.unsubscribe()
  }

  return {
    broadcastSubject,
    addTarget,
  }
}
