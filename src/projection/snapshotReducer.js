import { objectFrom } from '../lib/object/objectFrom'

export const createSnapshotReducer = (getStatFlowList) => {
  const snapshotReducer = () =>
    objectFrom(
      getStatFlowList()
        .filter((stateFlow) => !stateFlow.stateless)
        .map((stateFlow) => [stateFlow.name, stateFlow.getValue()]),
    )

  Object.defineProperty(snapshotReducer, 'name', {
    value: 'snapshot',
    writable: false,
  })

  Object.defineProperty(snapshotReducer, 'stateless', {
    value: true,
    writable: false,
  })

  return snapshotReducer
}
