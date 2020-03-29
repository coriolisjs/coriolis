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

createStore(({ withProjection, dispatch }) => {
  withProjection(currentCount).subscribe((count) => console.log(count))
  // 0

  dispatch({ type: 'incremented' })
  // 1

  dispatch({ type: 'incremented' })
  // 2

  dispatch({ type: 'decremented' })
  // 1
})
