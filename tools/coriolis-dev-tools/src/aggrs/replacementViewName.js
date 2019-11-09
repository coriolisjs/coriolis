import { currentView } from './currentView'
import { isDevtoolsOpen } from './isDevtoolsOpen'
import { defaultViewName } from './defaultViewName'

export const replacementViewName = ({ useAggr }) => (
  useAggr(isDevtoolsOpen),
  useAggr(currentView),
  useAggr(defaultViewName),
  (isOpen, view, defaultName) => !view && isOpen
    ? defaultName
    : undefined
)
