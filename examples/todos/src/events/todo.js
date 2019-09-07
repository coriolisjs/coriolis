import { createEventBuilder } from 'coriolis'

import { required } from '../libs/required'

export const added = createEventBuilder('Todo item has been added', ({
  text,
  done = false
}) => ({
  text: text || required('Todo item text is mandatory'),
  done
}))

export const edited = createEventBuilder('Todo item has been edited', ({
  id = required('Unable to edit todo item without an id'),
  text = required('Todo item text is mandatory')
}) => ({
  id,
  text
}))

export const removed = createEventBuilder('Todo item has been removed', ({
  id = required('Unable to delete todo item without an id')
}) => id)

export const done = createEventBuilder('Todo item has been marked as done', ({
  id = required('Unable to set a todo item done without an id')
}) => id)

export const reset = createEventBuilder('Todo item has been reset', ({
  id = required('Unable to reset a todo item without an id')
}) => id)
