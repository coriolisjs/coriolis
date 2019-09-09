import { createEventBuilder } from 'coriolis'

import { required } from '../libs/required'

export const changed = createEventBuilder(
  'Current view has been changed',
  ({ view }) =>
    view || required('Unable to change view without a view name')
)
