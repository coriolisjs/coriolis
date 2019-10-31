import { isDevtoolsOpen } from './isDevtoolsOpen'
import { currentView } from './currentView'

export const enabledViewComponent = ({ useAggr }) => (
  useAggr(isDevtoolsOpen),
  useAggr(currentView),
  (isOpen, view) => isOpen && view && view.component
)
