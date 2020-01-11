import { isDevtoolsOpen } from './isDevtoolsOpen'
import { currentView } from './currentView'

export const enabledViewName = ({ useProjection }) => (
  useProjection(isDevtoolsOpen),
  useProjection(currentView),
  (isOpen, view) => isOpen && view && view.name
)
