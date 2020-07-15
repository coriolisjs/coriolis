import { done, reset, added } from '../events/todo'
import { todolist } from '../projections/todo'

export const toggleDone = (itemId) => ({ getProjectionValue }) => {
  const item = getProjectionValue(todolist).find(({ id }) => id === itemId)

  if (item) {
    return item.done ? reset({ id: itemId }) : done({ id: itemId })
  }
}

export const addItem = (value) => () => value && added({ text: value })
