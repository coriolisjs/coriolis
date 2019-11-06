import { first } from '../lib/array/first'
import { last } from '../lib/array/last'
import { unshift } from '../lib/array/unshift'
import { get } from '../lib/object/get'

import { storeEvent, devtoolsAggrCalled } from '../events'

import { currentStoreId } from './currentStoreId'
import { fullAggrsIndex } from './aggrsList'

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
  useState({}),
  useEvent(storeEvent),
  (lists, { payload: { storeId, event: originalEvent, isInitialEvent }}) => ({
    ...lists,
    [storeId]: unshift(
      lists[storeId],
      createEventListItem(originalEvent, isInitialEvent, first(lists[storeId]), last(lists[storeId])),
    )
  })
)

const eventListWithAggrs = ({ useState, useEvent, useAggr }) => (
  useState({}),
  useEvent(devtoolsAggrCalled),
  useAggr(fullEventList),
  useAggr(fullAggrsIndex),
  (lists, { payload: { storeId, aggrId, args, newState }}, allEvents, aggrIndexes) => {
    const storeList = lists[storeId] || []
    const lastEvent = allEvents[storeId][0]
    const lastPassedEvent = storeList[0]

    const isNewEvent = !lastPassedEvent || lastEvent.meta !== lastPassedEvent.meta

    const aggrCalls = isNewEvent
      ? []
      : lastPassedEvent.aggrCalls

    return ({
      ...lists,
      [storeId]: [
        {
          ...lastEvent,
          aggrCalls: [
            ...aggrCalls,
            {
              ...aggrIndexes[storeId][aggrId],
              args,
              previousState: aggrIndexes[storeId][aggrId].aggregator.value,
              newState
            }
          ]
        },
        ...storeList.slice(isNewEvent ? 0 : 1)
      ]
    })
  }
)

export const eventList = ({ useAggr, lazyAggr }) => (
  useAggr(eventListWithAggrs),
  lazyAggr(currentStoreId),
  (allEvents, storeId) => get(allEvents, storeId)
)
