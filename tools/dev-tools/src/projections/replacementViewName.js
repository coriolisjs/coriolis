import { currentView } from './currentView'
import { isDevtoolsOpen } from './isDevtoolsOpen'
import { defaultViewName } from './defaultViewName'

export const replacementViewName = ({ useProjection }) => (
  useProjection(isDevtoolsOpen),
  useProjection(currentView),
  useProjection(defaultViewName),
  (isOpen, view, defaultName) => (!view && isOpen ? defaultName : undefined)
)
