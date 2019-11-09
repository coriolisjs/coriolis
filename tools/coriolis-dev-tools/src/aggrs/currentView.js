import { viewIndex } from './viewIndex'
import { currentViewName } from './currentViewName'

export const currentView = ({ useAggr }) => (
  useAggr(viewIndex),
  useAggr(currentViewName),
  (index, viewName) => index[viewName]
)
