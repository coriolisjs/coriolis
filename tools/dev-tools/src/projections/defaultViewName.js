import { viewList } from './viewList'

export const defaultViewName = ({ useProjection }) => (
  useProjection(viewList), list => list[0] && list[0].name
)
