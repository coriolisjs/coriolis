import { viewChanged } from '../events'

// sets aggr with long name to improve logs
const currentCoriolisDevToolsView = ({ useEvent }) => (
  useEvent(viewChanged),
  ({ payload }) => payload
)

// exports with short name for ease of use
export const currentView = currentCoriolisDevToolsView
