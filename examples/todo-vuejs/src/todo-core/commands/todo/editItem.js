import { required } from '../../libs/required'

import { edited } from '../../events/todo'

export const editItem = (id, text) => () => {
  if (!id) {
    required('Unable to edit todo item without an id')
  }

  if (!text) {
    required('Todo item text is mandatory')
  }

  return edited({ id, text })
}
