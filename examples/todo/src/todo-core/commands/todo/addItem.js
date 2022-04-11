import { added } from '../../events/todo'

export const addItem = (value) => () => {
  if (!value) {
    throw new Error('Todo item text is mandatory')
  }

  return added({ text: value })
}
