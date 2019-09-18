import { changed } from '../events/view'

const initialView = location.pathname.replace(/^\//, '')

export const currentView = ({ useState, useEvent }) => (
  useState(),
  useEvent(),
  (view = initialView, { type, payload }) => {
    if (type !== changed.toString()) {
      return view
    }

    return payload
  }
)
