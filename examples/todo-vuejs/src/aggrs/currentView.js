import { changed } from '../events/view'

export const currentView = (view, { type, payload }) => {
  if (type !== changed.toString()) {
    return view
  }

  return payload
}
