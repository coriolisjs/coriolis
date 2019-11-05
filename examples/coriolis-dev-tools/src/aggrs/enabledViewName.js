import { isDevtoolsOpen } from './isDevtoolsOpen'
import { currentView } from './currentView'

export const enabledViewName = ({ useAggr }) => (
  useAggr(isDevtoolsOpen),
  useAggr(currentView),
  (isOpen, view) => isOpen && view && view.name
)
