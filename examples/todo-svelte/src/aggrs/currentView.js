import { changed } from '../events/view'

export const currentView = ({ useEvent }) => (
  useEvent(changed),
  ({ payload }) => payload
)
