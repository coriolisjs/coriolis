import { produce } from 'immer'
import { not } from '../libs/function/not'

import { added, removed, done, reset, edited, filter, filters } from '../events/todo'

let nextItemId = 1
const newTodoItem = produce(item => {
  item.id = nextItemId++
})

const hasId = id => item => item.id === id

export const todolist = produce((draft, { type, payload, error }) => {
  if (error) {
    return
  }

  switch (type) {
    case added.toString():
      draft.push(newTodoItem(payload))
      break

    case edited.toString():
      const editedItem = draft.find(hasId(payload.id))

      if (editedItem) {
        editedItem.text = payload.text
      }
      break

    case done.toString():
    case reset.toString():
      const changedItem = draft.find(hasId(payload))

      if (changedItem) {
        changedItem.done = type === done.toString()
      }
      break

    case removed.toString():
      return draft.filter(not(hasId(payload)))

    default:
      break
  }
}, [])

export const todolistFilterName = (filterName = filters[0], { type, payload, error }) => {
  if (error || type !== filter.toString()) {
    return filterName
  }

  return payload
}

export const filteredTodolist = ({ useAggr }) => (
  useAggr(todolist),
  useAggr(todolistFilterName),
  produce((list, filterName) => {
    switch (filterName) {
      case 'active':
        return list.filter(({ done }) => !done)

      case 'done':
        return list.filter(({ done }) => done)

      default:
        break
    }
  })
)
