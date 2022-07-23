import { filters } from '../../data/filters'
import { filterChanged } from '../../events/todo'

export const setFilter = (filterName) => () => {
  if (!filters.includes(filterName)) {
    throw new Error(
      `Filter must be one of [${filters.join(', ')}] but got "${filterName}"`,
    )
  }

  return filterChanged({ filterName })
}
