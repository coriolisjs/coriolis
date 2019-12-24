import { lastPayloadOfType } from 'coriolis-parametered-aggr'

import { first } from '../lib/array/first'
import { last } from '../lib/array/last'
import { unshift } from '../lib/array/unshift'
import { get } from '../lib/object/get'

import { storeEvent, aggrCalled, selectedEventListItem } from '../events'

import { currentStoreId } from './currentStoreId'
import { fullAggrsIndex } from './aggrsList'

const getTimestampDelta = (timestamp2, timestamp1) =>
  timestamp1 ? timestamp2 - timestamp1 : 0

const createEventListItem = (
  event,
  isPastEvent,
  previousEvent,
  firstEvent,
) => ({
  type: event.type,
  payload: event.payload,
  meta: event.meta,
  error: event.error,
  isPastEvent,
  aggrCalls: [],

  date: new Date(event.meta.timestamp).toLocaleString(),
  timestamp: event.meta.timestamp,
  deltaN: getTimestampDelta(
    event.meta.timestamp,
    get(previousEvent, 'timestamp'),
  ),
  delta0: getTimestampDelta(event.meta.timestamp, get(firstEvent, 'timestamp')),
})

export const eventListSelectedEvent = lastPayloadOfType(selectedEventListItem)

const fullEventList = ({ useState, useEvent, useAggr }) => (
  useState({}),
  useEvent(aggrCalled, storeEvent),
  useAggr(fullAggrsIndex),
  (lists, event, aggrIndexes) => {
    const {
      payload: { storeId },
    } = event
    const eventList = lists[storeId]
    let newEventlist

    if (event.type === storeEvent.toString()) {
      const {
        payload: { event: originalEvent, isPastEvent },
      } = event
      newEventlist = unshift(
        eventList,
        createEventListItem(
          originalEvent,
          isPastEvent,
          first(eventList),
          last(eventList),
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

export const eventList = ({ useAggr }) => (
  useAggr(fullEventList),
  useAggr(currentStoreId),
  (allEvents, storeId) => get(allEvents, storeId) || []
)
