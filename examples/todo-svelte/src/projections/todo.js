import { produce } from 'immer'
import { not } from '../libs/function/not'

import {
  added,
  removed,
  done,
  reset,
  edited,
  filter,
  filters,
} from '../events/todo'

let nextItemId = 1
const newTodoItem = produce(item => {
  item.id = nextItemId++
})

const hasId = id => item => item.id === id

export const todolist = ({ useState, useEvent }) => (
  useState([]),
  useEvent(added, edited, done, reset, removed),
  produce((listDraft, { type, payload, error }) => {
    if (error) {
      return
    }

    switch (type) {
      case added.toString():
        listDraft.push(newTodoItem(payload))
        break

      case edited.toString():
        const editedItem = listDraft.find(hasId(payload.id))

        if (editedItem) {
          editedItem.text = payload.text
        }
        break

      case done.toString():
      case reset.toString():
        const changedItem = listDraft.find(hasId(payload))

        if (changedItem) {
          changedItem.done = type === done.toString()
        }
        break

      case removed.toString():
        return listDraft.filter(not(hasId(payload)))

      default:
        break
    }
  })
)

export const todolistFilterName = ({ useState, useEvent }) => (
  useState(filters[0]),
  useEvent(filter),
  (filterName, { payload, error }) => (error ? filterName : payload)
)

export const filteredTodolist = ({ useState, useProjection }) => (
  useProjection(todolist),
  useProjection(todolistFilterName),
  useState([]),
  produce((listDraft, filterName) => {
    switch (filterName) {
      case 'active':
        return listDraft.filter(({ done }) => !done)

      case 'done':
        return listDraft.filter(({ done }) => done)

      default:
        break
    }
  })
)
