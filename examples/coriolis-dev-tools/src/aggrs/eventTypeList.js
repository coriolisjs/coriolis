import { storeEvent } from '../events'
import { currentStoreId } from './currentStoreId'
import { get } from '../lib/object/get'

export const allEventTypeIndex = ({ useState, useEvent }) => (
  useState(),
  useEvent(storeEvent),
  (index = {}, { payload: { storeId, event: originalEvent }}) => ({
    ...index,
    [storeId]: {
      ...index[storeId],
      [originalEvent.type]: (get(index, storeId, originalEvent.type) || 0) + 1
    }
  })
)

export const eventTypeIndex = ({ useAggr }) => (
  useAggr(currentStoreId),
  useAggr(allEventTypeIndex),
  (storeId, index) => get(index, storeId)
)

export const eventTypeList = ({ useAggr }) => (
  useAggr(eventTypeIndex),
  index => Object.entries(index).map(([name, count]) => ({ name, count }))
)
