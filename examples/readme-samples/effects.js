import { currentCount, lastRequiredDouble } from './projections'
import { incremented, decremented, requiredDouble } from './events'

export const myDoublingEffect = ({ withProjection, dispatch }) => {
  const currentCount$ = withProjection(currentCount)

  withProjection(lastRequiredDouble).subscribe(() => {
    const count = currentCount$.value
    for (let i = 0; i < count; i++) {
      dispatch(incremented())
    }
  })
}

export const myDisplayEffect = ({ withProjection }) => {
  withProjection(currentCount).subscribe(count => console.log('Current count', count))
  // Immediately logs "Current count 0", than other count values on each change
}

export const myUserEffect = ({ dispatch }) => {
  dispatch(incremented())
  // Current count 1

  dispatch(incremented())
  // Current count 2

  dispatch(requiredDouble())
  // Current count 3
  // Current count 4

  dispatch(decremented())
  // Current count 3
}
