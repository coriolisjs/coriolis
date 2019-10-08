import { viewChanged } from '../events'

export const currentView = (view, { type, payload }) => {
  switch(type) {
    case viewChanged.toString():
      return payload

    default:
      return view
  }
}
