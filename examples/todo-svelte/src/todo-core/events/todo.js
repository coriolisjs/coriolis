import { createEventBuilder } from '@coriolis/coriolis'

export const added = createEventBuilder(
  'Todo item has been added',
  ({ text, done = false }) => ({
    text,
    done,
  }),
)

export const edited = createEventBuilder(
  'Todo item has been edited',
  ({ id, text }) => ({
    id,
    text,
  }),
)

export const removed = createEventBuilder(
  'Todo item has been removed',
  ({ id }) => id,
)

export const done = createEventBuilder(
  'Todo item has been marked as done',
  ({ id }) => id,
)

export const reset = createEventBuilder(
  'Todo item has been reset',
  ({ id }) => id,
)

export const filterChanged = createEventBuilder(
  'Todo-list filter has been changed',
  ({ filterName }) => filterName,
)
