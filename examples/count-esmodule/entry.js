import { createStore } from '@coriolis/coriolis'

const currentCount = ({ useState, useEvent }) => (
  useState(0),
  useEvent(),
  (state, event) => {
    switch (event.type) {
      case 'incremented':
        return state + 1

      case 'decremented':
        return state - 1

      default:
        return state
    }
  }
)

createStore(({ withProjection, eventSubject }) => {
  withProjection(currentCount).subscribe(count => console.log(count))
  // 0

  eventSubject.next({ type: 'incremented' })
  // 1

  eventSubject.next({ type: 'incremented' })
  // 2

  eventSubject.next({ type: 'decremented' })
  // 1
})
