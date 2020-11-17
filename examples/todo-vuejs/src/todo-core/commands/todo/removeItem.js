import { required } from '../../libs/required'

import { removed } from '../../events/todo'

export const removeItem = (id) => () => {
  if (!id) {
    required('Unable to delete todo item without an id')
  }

  return removed({ id })
}
