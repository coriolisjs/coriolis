import { get } from '../lib/object/get'

import {
  aggregatorCreated,
  projectionSetup,
  projectionCalled,
  aggregatorCalled,
} from '../events'

import { currentStoreId } from './currentStoreId'

const reduceProjectionState = (
  state = {},
  {
    type,
    payload: {
      projectionId,
      projection,
      projectionBehavior,
      event,
      aggregator,
    },
  },
) => {
  switch (type) {
    case aggregatorCreated.toString():
      return {
        projectionId,
        projection,
        name: projection.name || 'unnamed',
        aggregator,
      }

    case projectionSetup.toString():
      return {
        ...state,
        projectionBehavior:
          get(projectionBehavior, 'message') || projectionBehavior,
        setupCalls: (state.setupCalls || 0) + 1,
        isReducer: typeof projectionBehavior !== 'function',
      }

    case projectionCalled.toString():
      return {
        ...state,
        projectionCalls: (state.projectionCalls || 0) + 1,
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

export const fullProjectionsIndex = ({ useState, useEvent }) => (
  useState({}),
  useEvent(
    aggregatorCreated,
    projectionSetup,
    projectionCalled,
    aggregatorCalled,
  ),
  (list, { type, payload }) => ({
    ...list,
    [payload.storeId]: {
      ...list[payload.storeId],
      [payload.projectionId]: reduceProjectionState(
        get(list, payload.storeId, payload.projectionId),
        { type, payload },
      ),
    },
  })
)

const projectionsIndex = ({ useProjection }) => (
  useProjection(fullProjectionsIndex),
  useProjection(currentStoreId),
  (fullIndex, storeId) => get(fullIndex, storeId) || {}
)

export const projectionsList = ({ useProjection }) => (
  useProjection(projectionsIndex), index => Object.values(index)
)
