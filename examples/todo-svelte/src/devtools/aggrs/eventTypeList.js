import { eventStoreEvent } from '../events'

export const eventTypeIndex = ({ useState, useAggr }) => (
  useState(),
  useAggr(eventStoreEvent.toAggr()),
  (index = {}, { payload: { event: originalEvent }}) => ({
    ...index,
    [originalEvent.type]: (index[originalEvent.type] || 0) + 1
  })
)

export const eventTypeList = ({ useAggr }) => (
  useAggr(eventTypeIndex),
  index => Object.entries(index).map(([name, count]) => ({ name, count }))
)
