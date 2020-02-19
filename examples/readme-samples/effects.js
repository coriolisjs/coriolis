import { currentCount, lastRequiredDouble } from './projections'
import { incremented, decremented, requiredDouble } from './events'

export const myDoublingEffect = ({ withProjection, dispatchEvent }) => {
  const currentCount$ = withProjection(currentCount)

  withProjection(lastRequiredDouble).subscribe(() => {
    for (let i = 0; i < currentCount$.value; i++) {
      dispatchEvent(incremented())
    }
  })
}

export const myDisplayEffect = ({ withProjection }) => {
  withProjection(currentCount).subscribe(count => console.log('Current count', count))
  // Immediately logs "Current count 0", than other count values on each change
}

export const myUserEffect = ({ dispatchEvent }) => {
  dispatchEvent(incremented())
  // Current count 1

  dispatchEvent(incremented())
  // Current count 2

  dispatchEvent(requiredDouble())
  // Current count 3
  // Current count 4

  dispatchEvent(decremented())
  // Current count 3
}
