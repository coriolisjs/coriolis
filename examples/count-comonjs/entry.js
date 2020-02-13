const { createStore } = require('@coriolis/coriolis')

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

createStore(({ withProjection, dispatchEvent }) => {
  withProjection(currentCount).subscribe(count => console.log(count))
  // 0

  dispatchEvent({ type: 'incremented' })
  // 1

  dispatchEvent({ type: 'incremented' })
  // 2

  dispatchEvent({ type: 'decremented' })
  // 1
})
