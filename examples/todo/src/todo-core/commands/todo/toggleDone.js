import { done, reset } from '../../events/todo'
import { todolist } from '../../projections/todo'

export const toggleDone = (itemId) => ({ getProjectionValue }) => {
  if (!itemId) {
    throw new Error('Unable to set a todo item done without an id')
  }

  const item = getProjectionValue(todolist).find(({ id }) => id === itemId)

  if (!item) {
    throw new Error('Unable to find matching todo item')
  }

  return item.done ? reset({ id: itemId }) : done({ id: itemId })
}
