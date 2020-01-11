import { viewIndex } from './viewIndex'
import { currentViewName } from './currentViewName'

export const currentView = ({ useProjection }) => (
  useProjection(viewIndex),
  useProjection(currentViewName),
  (index, viewName) => index[viewName]
)
