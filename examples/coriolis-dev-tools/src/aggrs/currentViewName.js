import { viewChanged } from '../events'

export const currentViewName = ({ useEvent }) => (
  useEvent(viewChanged),
  ({ payload }) => payload
)
