import { viewAdded } from '../events'

export const viewList = ({ useState, useEvent }) => (
  useState([]),
  useEvent(viewAdded),
  (list, { payload }) => [
    ...list,
    payload
  ]
)
