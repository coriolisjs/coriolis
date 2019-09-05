import { findreplace } from '../libs/array/findreplace'
import { not } from '../libs/function/not'

import { added, removed, done, reset, edited } from '../events/todo'

const setTodoText = text => item => ({
  ...item,
  text
})

const setTodoDone = done => item => ({
  ...item,
  done
})

const hasId = id => item => item.id === id

export const todolist = (state = [], { type, payload, error }) => {
  if (error) {
    return state
  }

  switch (type) {
    case added.toString():
      return [
        ...state,
        payload
      ]

    case edited.toString():
      return findreplace(
        state,
        hasId(payload.id),
        setTodoText(payload.text)
      )

    case done.toString():
    case reset.toString():
      return findreplace(
        state,
        hasId(payload),
        setTodoDone(type === done.toString())
      )

    case removed.toString():
      return state.filter(not(hasId(payload)))

    default:
      return state
  }
}
