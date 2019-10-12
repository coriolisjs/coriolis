const getTimestampDelta = (timestamp2, timestamp1) => timestamp1
  ? timestamp2 - timestamp1
  : 0

export const eventList = (list = [], event) => [{
  type: event.type,
  payload: event.payload,
  meta: event.meta,
  error: event.error,

  date: (new Date(event.meta.timestamp)).toLocaleString(),
  timestamp: event.meta.timestamp,
  deltaN: getTimestampDelta(event.meta.timestamp, list[0] && list[0].timestamp),
  delta0: getTimestampDelta(event.meta.timestamp, list[list.length - 1] && list[list.length - 1].timestamp)
}, ...list]
