import { lastPayloadOfType } from 'coriolis-parametered-projection'

import { first } from '../lib/array/first'
import { last } from '../lib/array/last'
import { unshift } from '../lib/array/unshift'
import { get } from '../lib/object/get'

import { storeEvent, projectionCalled, selectedEventListItem, aggregatorCreated } from '../events'

import { currentStoreId } from './currentStoreId'
import { fullProjectionsIndex } from './projectionsList'

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
  projectionCalls: [],

  date: new Date(event.meta.timestamp).toLocaleString(),
  timestamp: event.meta.timestamp,
  deltaN: getTimestampDelta(
    event.meta.timestamp,
    get(previousEvent, 'timestamp'),
  ),
  delta0: getTimestampDelta(event.meta.timestamp, get(firstEvent, 'timestamp')),
})

export const eventListSelectedEvent = lastPayloadOfType(selectedEventListItem)

const ifUndefined = (value, defaultValue) => (value === undefined || value === null) ? defaultValue : value;

const fullEventList = ({ useState, useEvent, useProjection }) => (
  useState({}),
  useEvent(projectionCalled, storeEvent, aggregatorCreated),
  useProjection(fullProjectionsIndex),
  (lists, event, projectionIndexes) => {
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
    } else if (event.type === aggregatorCreated.toString()) {
      newEventlist = unshift(
        eventList,
        {
          type: `Init projection ${event.payload.projection.name}`,
          error: false,
          payload: event.payload.aggregator.value,
          isPastEvent: ifUndefined(get(first(eventList), 'isPastEvent'), true),
          projectionCalls: [],

          date: new Date(event.meta.timestamp).toLocaleString(),
          timestamp: event.meta.timestamp,
          deltaN: getTimestampDelta(
            event.meta.timestamp,
            get(first(eventList), 'timestamp'),
          ),
          delta0: getTimestampDelta(event.meta.timestamp, get(last(eventList), 'timestamp')),
        },
      )
    } else {
      const {
        payload: { storeId, projectionId, args, newState },
      } = event

      const lastEvent = eventList[0]
      const projectionData = projectionIndexes[storeId][projectionId]

      newEventlist = [
        {
          ...lastEvent,
          projectionCalls: [
            ...lastEvent.projectionCalls,
            {
              ...projectionData,
              args,
              previousState: projectionData.aggregator.value,
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

export const eventList = ({ useProjection }) => (
  useProjection(fullEventList),
  useProjection(currentStoreId),
  (allEvents, storeId) => get(allEvents, storeId) || []
)
