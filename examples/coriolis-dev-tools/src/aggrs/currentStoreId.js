import { currentStoreChanged, storeAdded } from '../events'

export const currentStoreId = ({ useState, useEvent }) => (
  useState(),
  useEvent(currentStoreChanged, storeAdded),
  (lastStoreId, { type, payload }) =>
    type === currentStoreChanged.toString()
      ? payload
      : lastStoreId === undefined
        ? payload.storeId
        : lastStoreId
)
