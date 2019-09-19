import { changed } from '../events/view'

const initialView = location.pathname.replace(/^\//, '')

export const currentView = (view = initialView, { type, payload }) => {
  if (type !== changed.toString()) {
    return view
  }

  return payload
}
