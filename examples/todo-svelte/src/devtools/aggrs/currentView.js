import { viewChanged } from '../events'

const currentCoriolisDevToolsView = (view, { type, payload }) => {
  switch(type) {
    case viewChanged.toString():
      return payload

    default:
      return view
  }
}

export const currentView = currentCoriolisDevToolsView
