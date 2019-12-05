import { viewList } from './viewList'

export const defaultViewName = ({ useAggr }) => (
  useAggr(viewList), list => list[0] && list[0].name
)
