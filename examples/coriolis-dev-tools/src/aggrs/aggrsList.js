import { get } from '../lib/object/get'

import { devtoolsAggregatorCreated, devtoolsAggrSetup, devtoolsAggrCalled, devtoolsAggregatorCalled } from '../events'
import { currentStoreId } from './currentStoreId'

const reduceAggrState = (state = {}, { type, payload: { aggrId, aggr, aggrBehavior }}) => {
  switch(type) {
    case devtoolsAggregatorCreated.toString():
      return {
        aggrId,
        aggr,
        name: aggr.name || 'unnamed'
      }

    case devtoolsAggrSetup.toString():
      return {
        ...state,
        aggrBehavior: get(aggrBehavior, 'message') || aggrBehavior,
        setupCalls: (state.setupCalls || 0) + 1,
        isReducer: typeof aggrBehavior !== 'function'
      }

    case devtoolsAggrCalled.toString():
      return {
        ...state,
        aggrCalls: (state.aggrCalls || 0) + 1,
        cachedCalls: (state.cachedCalls || 0) - 1,
        isReducer: state.isReducer || !state.setupCalls
      }


    case devtoolsAggregatorCalled.toString():
      return {
        ...state,
        aggregatorCalls: (state.aggregatorCalls || 0) + 1,
        cachedCalls: (state.cachedCalls || 0) + 1
      }
  }
}

export const fullAggrsIndex = ({ useState, useEvent }) => (
  useState(),
  useEvent(devtoolsAggregatorCreated, devtoolsAggrSetup, devtoolsAggrCalled, devtoolsAggregatorCalled),
  (list = {}, { type, payload }) => ({
    ...list,
    [payload.storeId]: {
      ...list[payload.storeId],
      [payload.aggrId]: reduceAggrState(get(list, payload.storeId, payload.aggrId), { type, payload })
    }
  })
)

export const aggrsList = ({ useAggr }) => (
  useAggr(currentStoreId),
  useAggr(fullAggrsIndex),
  (storeId, fullIndex) => Object.values(get(fullIndex, storeId) || {})
)
