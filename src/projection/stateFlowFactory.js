import { createIndex } from '../lib/map/objectIndex'
import { objectFrom } from '../lib/object/objectFrom'

import { compileProjection } from './compile'
import { createReducerState } from './reducerState'
import { createStateFlow as defaultCreateStateFlow } from './stateFlow'

// snapshot is a unique projection that will return every indexed projections' last state
// this function must be an unique reference, so as an example we must not use rxjs' noop here
export const snapshot = () => {}

const getInitialState = (projection, getStateFlow) => {
  const { reducer, initialState } = compileProjection(projection, getStateFlow)

  return createReducerState(reducer, initialState)
}

const createInternalGetter = (factoryGet) => (...args) =>
  factoryGet(...args).internal

const createExternalGetter = (factoryGet) => (...args) =>
  factoryGet(...args).external

export const createStateFlowFactory = (
  event$,
  skipUntil$,
  createStateFlow = defaultCreateStateFlow,
) => {
  const factory = createIndex((projection, reducer, initialState) =>
    createStateFlow(
      projection === snapshot
        ? snapshotInitialState
        : projection === 'reducer'
        ? createReducerState(reducer, initialState)
        : getInitialState(projection, createInternalGetter(factory.get)),
      event$,
      skipUntil$,
    ),
  )

  const snapshotInitialState = createReducerState(() =>
    objectFrom(
      factory
        .list()
        // we don't want to list snapshot aggregator's state as it would cause a recursive loop
        .filter(([projection]) => projection !== snapshot)
        .map(([, stateFlow]) => [
          stateFlow.name,
          stateFlow.internal.getValue(),
        ]),
    ),
  )

  return createExternalGetter(factory.get)
}
