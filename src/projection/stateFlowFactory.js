import { createIndex } from '../lib/map/objectIndex'
import { objectFrom } from '../lib/object/objectFrom'

import { compileProjection } from './compile'
import { createReducedProjection } from './reducedProjection'
import { createStateFlow as defaultCreateStateFlow } from './stateFlow'

// snapshot is a unique projection that will return every indexed projections' last state
// this function must be an unique reference, so as an example we must not use rxjs' noop here
export const snapshot = () => {}

const getInitialState = (projection, getStateFlow) => {
  const { reducer, initialState } = compileProjection(projection, getStateFlow)

  return createReducedProjection(reducer, initialState)
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
        ? createReducedProjection(reducer, initialState)
        : getInitialState(projection, createInternalGetter(factory.get)),
      event$,
      skipUntil$,
    ),
  )

  const snapshotReducer = () =>
    objectFrom(
      factory
        .list()
        // we don't want to list snapshot aggregator's state as it would cause a recursive loop
        .filter(([projection]) => projection !== snapshot)
        .map(([, stateFlow]) => [
          stateFlow.name,
          stateFlow.internal.getValue(),
        ]),
    )

  snapshotReducer.name = 'snapshot'
  snapshotReducer.stateless = true

  const snapshotInitialState = createReducedProjection(snapshotReducer)

  return createExternalGetter(factory.get)
}
