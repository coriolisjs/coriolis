import { viewList } from './viewList'

export const viewIndex = ({ useAggr }) => (
  useAggr(viewList),
  list => list.reduce((idx, view) => ({
    ...idx,
    [view.name]: view
  }), {})
)
