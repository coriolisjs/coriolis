import { currentCount } from './projections'
import { incremented, decremented } from './events'
import { double } from './commands'

export const myDisplayEffect = ({ withProjection }) => {
  withProjection(currentCount).subscribe(
    count => console.log('Current count', count),
    // Immediately logs "Current count 0", than other count values on each change
  )
}

export const myUserEffect = ({ dispatch }) => {
  dispatch(incremented())
  // Current count 1

  dispatch(incremented())
  // Current count 2

  dispatch(double)
  // Current count 3
  // Current count 4

  dispatch(decremented())
  // Current count 3
}
