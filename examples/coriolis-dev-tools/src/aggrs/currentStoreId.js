import { currentStoreChanged, storeAdded } from '../events'

export const currentStoreId = ({ useEvent }) => (
  useEvent(currentStoreChanged),
  useEvent(storeAdded),
  (
    { payload: currentId } = {},
    { payload: { storeId: addedId }} = { payload: {}}
  ) =>
    currentId || addedId
)
