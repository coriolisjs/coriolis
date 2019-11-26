import { first } from '../lib/array/first'
import { last } from '../lib/array/last'
import { unshift } from '../lib/array/unshift'
import { get } from '../lib/object/get'

import { storeEvent, aggrCalled } from '../events'

import { currentStoreId } from './currentStoreId'
import { fullAggrsIndex } from './aggrsList'

const getTimestampDelta = (timestamp2, timestamp1) =>
  timestamp1 ? timestamp2 - timestamp1 : 0

const createEventListItem = (
  event,
  isInitialEvent,
  previousEvent,
  firstEvent,
) => ({
  type: event.type,
  payload: event.payload,
  meta: event.meta,
  error: event.error,
  isInitialEvent,
  aggrCalls: [],

  date: new Date(event.meta.timestamp).toLocaleString(),
  timestamp: event.meta.timestamp,
  deltaN: getTimestampDelta(
    event.meta.timestamp,
    get(previousEvent, 'timestamp'),
  ),
  delta0: getTimestampDelta(event.meta.timestamp, get(firstEvent, 'timestamp')),
})

const fullEventList = ({ useState, useEvent, useAggr }) => (
  useState({}),
  useEvent(aggrCalled, storeEvent),
  useAggr(fullAggrsIndex),
  (lists, event, aggrIndexes) => {
    const eventList = lists[storeId]
    let newEventlist

    if (event.type === storeEvent.toString()) {
      const {
        payload: { storeId, event: originalEvent, isInitialEvent },
      } = event
      newEventlist = unshift(
        lists[storeId],
        createEventListItem(
          originalEvent,
          isInitialEvent,
          first(lists[storeId]),
          last(lists[storeId]),
        ),
      )
    } else {
      const {
        payload: { storeId, aggrId, args, newState },
      } = event

      const lastEvent = eventList[0]
      const aggrData = aggrIndexes[storeId][aggrId]

      newEventlist = [
        {
          ...lastEvent,
          aggrCalls: [
            ...lastEvent.aggrCalls,
            {
              ...aggrData,
              args,
              previousState: aggrData.aggregator.value,
              newState,
            },
          ],
        },
        ...eventList.slice(1),
      ]
    }

    return {
      ...lists,
      [storeId]: newEventlist,
    }
  }
)

export const eventList = ({ useAggr, lazyAggr }) => (
  useAggr(fullEventList),
  lazyAggr(currentStoreId),
  (allEvents, storeId) => get(allEvents, storeId)
)
