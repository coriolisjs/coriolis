import { parameteredAggr } from 'coriolis'

import { currentView } from './currentView'
import { isDevtoolsOpen } from './isDevtoolsOpen'

export const isAvailableView = parameteredAggr(({ useParam, useAggr }) => (
  useParam(),
  useAggr(isDevtoolsOpen),
  useAggr(currentView),
  (viewNames, isOpen, viewName) => viewNames.includes(viewName) || !isOpen
))
