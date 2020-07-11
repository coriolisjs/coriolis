import { createEventBuilder } from '@coriolis/coriolis'

import { required } from '../libs/required'

export const added = createEventBuilder(
  'Todo item has been added',
  ({ text, done = false }) => ({
    text: text || required('Todo item text is mandatory'),
    done,
  }),
)

export const edited = createEventBuilder(
  'Todo item has been edited',
  ({ id, text }) => ({
    id: id || required('Unable to edit todo item without an id'),
    text: text || required('Todo item text is mandatory'),
  }),
)

export const removed = createEventBuilder(
  'Todo item has been removed',
  ({ id }) => id || required('Unable to delete todo item without an id'),
)

export const done = createEventBuilder(
  'Todo item has been marked as done',
  ({ id }) => id || required('Unable to set a todo item done without an id'),
)

export const reset = createEventBuilder(
  'Todo item has been reset',
  ({ id }) => id || required('Unable to reset a todo item without an id'),
)

export const filter = createEventBuilder(
  'Todo-list filter has been changed',
  ({ filterName }) =>
    (filters.includes(filterName) && filterName) ||
    required(`Filter must be one of [${filters.join(', ')}]`),
)

export const filters = ['all', 'active', 'done']
