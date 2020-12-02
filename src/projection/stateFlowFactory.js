import { createIndex } from '../lib/map/objectIndex'
import { objectFrom } from '../lib/object/objectFrom'

import { compileProjection } from './compile'
import { createReducerState } from './reducerState'
import { createStateFlow } from './stateFlow'

// snapshot is a unique projection that will return every indexed projections' last state
// this function must be an unique reference, so as an example we must not use rxjs' noop here
export const snapshot = () => {}

const getInitialState = (projection, getStateFlow) => {
  const { reducer, initialState } = compileProjection(projection, getStateFlow)

  return createReducerState(reducer, initialState)
}

const createInternalGetter = (factoryGet) => (projection) =>
  factoryGet(projection).internal

const createExternalGetter = (factoryGet) => (projection) =>
  factoryGet(projection).external

export const createStateFlowFactory = (event$, skipUntil$) => {
  const factory = createIndex((projection) =>
    createStateFlow(
      projection === snapshot
        ? snapshotInitialState
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
        .map(([projection, stateFlow]) => [
          projection.name,
          stateFlow.internal.getValue(),
        ]),
    ),
  )

  return createExternalGetter(factory.get)
}
