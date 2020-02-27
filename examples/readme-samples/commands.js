import { incremented } from './events'
import { currentCount } from './projections'

const arrayOf = (length, builder) => Array.from({ length }).map(builder)

export const double = ({ withProjection }) => {
  const count = withProjection(currentCount).value

  const events = arrayOf(count, incremented)

  return events
}
