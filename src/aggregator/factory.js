import { createAggregator } from './index'
import { createIndex } from '../lib/map/objectIndex'
import { withValueGetter } from '../lib/object/valueGetter'
import { objectFrom } from '../lib/object/objectFrom'

// snapshot is a unique projection that will return every indexed projections' last state
// this function must be an unique reference, so as an example we must not use rxjs' noop here
export const snapshot = () => {}

export const createAggregatorFactory = (
  aggregatorBuilder = createAggregator,
) => {
  const factory = createIndex((projection) =>
    projection === snapshot
      ? getSnapshot
      : aggregatorBuilder(projection, factory.get),
  )

  // to build a snapshot, we get the current state from each aggregator and put
  // all this in an object, using aggregator definition's name as keys. If any conflicts
  // on names, numbers are concatenated on conflicting keys (aKey, aKey-2, aKey-3...)
  const getSnapshot = withValueGetter(() =>
    objectFrom(
      factory
        .list()
        // we don't want to list snapshot aggregator's state as it would cause a recursive loop
        .filter(([projection]) => projection !== snapshot)
        .map(([projection, aggregator]) => [projection.name, aggregator.value]),
    ),
  )

  return factory.get
}
