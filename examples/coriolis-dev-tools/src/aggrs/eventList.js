import { storeEvent } from '../events'
import { currentStoreId } from './currentStoreId'
import { first } from '../lib/array/first'
import { last } from '../lib/array/last'
import { unshift } from '../lib/array/unshift'
import { get } from '../lib/object/get'

const getTimestampDelta = (timestamp2, timestamp1) => timestamp1
  ? timestamp2 - timestamp1
  : 0

const createEventListItem = (event, isInitialEvent, previousEvent, firstEvent) => ({
  type: event.type,
  payload: event.payload,
  meta: event.meta,
  error: event.error,
  isInitialEvent,

  date: (new Date(event.meta.timestamp)).toLocaleString(),
  timestamp: event.meta.timestamp,
  deltaN: getTimestampDelta(event.meta.timestamp, get(previousEvent, 'timestamp')),
  delta0: getTimestampDelta(event.meta.timestamp, get(firstEvent, 'timestamp'))
})

const fullEventList = ({ useState, useEvent }) => (
  useState(),
  useEvent(storeEvent),
  (lists = {}, { payload: { storeId, event: originalEvent, isInitialEvent }}) =>
    ({
      ...lists,
      [storeId]: unshift(
        lists[storeId],
        createEventListItem(originalEvent, isInitialEvent, first(lists[storeId]), last(lists[storeId])),
      )
    })
)

export const eventList = ({ useAggr }) => (
  useAggr(currentStoreId),
  useAggr(fullEventList),
  (currentStoreId, allEvents) => get(allEvents, currentStoreId)
)
