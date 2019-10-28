import { eventStoreEvent } from '../events'

const getTimestampDelta = (timestamp2, timestamp1) => timestamp1
  ? timestamp2 - timestamp1
  : 0

export const eventList = ({ useState, useAggr }) => (
  useState(),
  useAggr(eventStoreEvent.toAggr()),
  (list = [], { payload: originalEvent }) => [{
    type: originalEvent.type,
    payload: originalEvent.payload,
    meta: originalEvent.meta,
    error: originalEvent.error,

    date: (new Date(originalEvent.meta.timestamp)).toLocaleString(),
    timestamp: originalEvent.meta.timestamp,
    deltaN: getTimestampDelta(originalEvent.meta.timestamp, list[0] && list[0].timestamp),
    delta0: getTimestampDelta(originalEvent.meta.timestamp, list[list.length - 1] && list[list.length - 1].timestamp)
  }, ...list]
)
