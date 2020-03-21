import { incremented } from './events'
import { currentCount } from './projections'

const arrayOf = (length, builder) => Array.from({ length }).map(builder)

export const double = ({ getProjectionValue }) => {
  const count = getProjectionValue(currentCount)

  return arrayOf(count, incremented)
}
