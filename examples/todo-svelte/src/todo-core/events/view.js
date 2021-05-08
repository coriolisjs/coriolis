import { createEventBuilder } from '@coriolis/coriolis'

export const changed = createEventBuilder(
  'Current view has been changed',
  ({ view }) => view,
)
