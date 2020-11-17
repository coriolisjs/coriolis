import { done, reset, added } from '../events/todo'

export const toggleDone = (id, isDone) => () =>
  isDone ? reset({ id }) : done({ id })

export const addItem = (value) => () => value && added({ text: value })
