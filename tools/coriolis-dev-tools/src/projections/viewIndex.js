import { viewList } from './viewList'

export const viewIndex = ({ useProjection }) => (
  useProjection(viewList),
  list =>
    list.reduce(
      (idx, view) => ({
        ...idx,
        [view.name]: view,
      }),
      {},
    )
)
