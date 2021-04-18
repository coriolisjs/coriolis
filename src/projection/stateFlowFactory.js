import { createIndex } from '../lib/map/objectIndex'
import { objectFrom } from '../lib/object/objectFrom'

import { compileProjection } from './compile'
import { createReducedProjection } from './reducedProjection'
import { createStateFlow as defaultCreateStateFlow } from './stateFlow'

// snapshot is a unique projection that will return every indexed statefull projections' last state
// this function must be an unique reference, so as an example we must not use rxjs' noop here
export const snapshot = () => 'this is not a usual noop function'

const createSnapshotReducedProjection = (factory) => {
  const snapshotReducer = () =>
    objectFrom(
      factory
        .list()
        // we don't want to list snapshot projection as it would cause a recursive loop
        .filter(([projection]) => projection !== snapshot)
        .filter(([, stateFlow]) => !stateFlow.stateless)
        .map(([, stateFlow]) => [
          stateFlow.name,
          stateFlow.internal.getValue(),
        ]),
    )

  Object.defineProperty(snapshotReducer, 'name', {
    value: 'snapshot',
    writable: false,
  })

  Object.defineProperty(snapshotReducer, 'stateless', {
    value: true,
    writable: false,
  })

  return createReducedProjection(snapshotReducer)
}

const compileToReducedProjection = (projection, getStateFlow) => {
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
  const factory = createIndex(
    // Two possible signatures :
    //     (projection) => stateFlow
    //     ('reducer', reducer, initialState) => stateFlow
    (projection, reducer, initialState) =>
      createStateFlow(
        projection === 'reducer'
          ? createReducedProjection(reducer, initialState)
          : projection === snapshot
          ? snapshotReducedProjection
          : compileToReducedProjection(
              projection,
              createInternalGetter(factory.get),
            ),
        event$,
        skipUntil$,
      ),
  )

  const snapshotReducedProjection = createSnapshotReducedProjection(factory)

  return createExternalGetter(factory.get)
}
