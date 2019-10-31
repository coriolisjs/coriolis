import { devtoolsEventListFilterChange } from '../events'

export const eventListFilter = ({ useEvent }) => (
  useEvent(devtoolsEventListFilterChange),
  ({ payload }) => payload
)
