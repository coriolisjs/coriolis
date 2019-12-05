import { get } from '../lib/object/get'

import {
  aggregatorCreated,
  aggrSetup,
  aggrCalled,
  aggregatorCalled,
} from '../events'

import { currentStoreId } from './currentStoreId'

const reduceAggrState = (
  state = {},
  { type, payload: { aggrId, aggr, aggrBehavior, event, aggregator } },
) => {
  switch (type) {
    case aggregatorCreated.toString():
      return {
        aggrId,
        aggr,
        name: aggr.name || 'unnamed',
        aggregator,
      }

    case aggrSetup.toString():
      return {
        ...state,
        aggrBehavior: get(aggrBehavior, 'message') || aggrBehavior,
        setupCalls: (state.setupCalls || 0) + 1,
        isReducer: typeof aggrBehavior !== 'function',
      }

    case aggrCalled.toString():
      return {
        ...state,
        aggrCalls: (state.aggrCalls || 0) + 1,
        cachedCalls: (state.cachedCalls || 0) - 1,
        isReducer: state.isReducer || !state.setupCalls,
      }

    case aggregatorCalled.toString():
      return {
        ...state,
        aggregatorCalls: (state.aggregatorCalls || 0) + 1,
        cachedCalls: (state.cachedCalls || 0) + !!event,
        stateCalls: (state.stateCalls || 0) + !event,
      }
  }
}

export const fullAggrsIndex = ({ useState, useEvent }) => (
  useState({}),
  useEvent(aggregatorCreated, aggrSetup, aggrCalled, aggregatorCalled),
  (list, { type, payload }) => ({
    ...list,
    [payload.storeId]: {
      ...list[payload.storeId],
      [payload.aggrId]: reduceAggrState(
        get(list, payload.storeId, payload.aggrId),
        { type, payload },
      ),
    },
  })
)

const aggrsIndex = ({ useAggr }) => (
  useAggr(fullAggrsIndex),
  useAggr(currentStoreId),
  (fullIndex, storeId) => get(fullIndex, storeId) || {}
)

export const aggrsList = ({ useAggr }) => (
  useAggr(aggrsIndex), index => Object.values(index)
)
