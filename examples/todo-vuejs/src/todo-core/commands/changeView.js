import { required } from '../libs/required'

import { changed } from '../events/view'

export const changeView = (view) => () => {
  if (!view) {
    required('Unable to change view without a view name')
  }

  // This would be a good place to check view exists
  // to do so we would need views list to have been dispatched as an event

  return changed({ view })
}
