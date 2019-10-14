import { devtoolsEventListFilterChange } from '../events'

export const eventListFilter = (filter, event) => {
  if (event.type !== devtoolsEventListFilterChange.toString()) {
    return filter
  }

  return event.payload
}
