import { Observable, Subject } from 'rxjs'

export const createBroadcastSubject = () => {
  const eventsEntry = new Subject()
  const feedbacksEntry = new Subject()

  const broadcastSubject = Subject.create(eventsEntry, feedbacksEntry)

  const addTarget = target => {
    const targetEvents = eventsEntry.subscribe(target)

    if (target instanceof Observable) {
      // target's feedback completion should not complete feedback entry
      const targetFeedback = target.subscribe(
        payload => feedbacksEntry.next(payload),
        error => feedbacksEntry.error(error),
      )

      return () => {
        targetEvents.unsubscribe()
        targetFeedback.unsubscribe()
      }
    }

    return () => targetEvents.unsubscribe()
  }

  return {
    broadcastSubject,
    addTarget,
  }
}
