import { of } from 'rxjs'
import { distinctUntilChanged, map, skipUntil } from 'rxjs/operators'

import { createIndex } from './lib/map/objectIndex'
import { setValueGetter } from './lib/object/valueGetter'
import { simpleUnsub } from './lib/rx/simpleUnsub'
import { ensureInitial } from './lib/rx/operator/ensureInitial'

import { createAggregatorFactory } from './aggregator'

export const createProjectionWrapperFactory = (
  event$,
  skipUntil$ = of(true),
  getAggregator = createAggregatorFactory(),
) =>
  createIndex(projection => {
    const aggregator = getAggregator(projection)

    const projection$ = event$.pipe(
      map(aggregator),

      // while init is not finished (old events replaying), we expect projections to
      // get all events, but we don't want any new state emited (it's not new states, it's old state reaggregated)
      skipUntil(skipUntil$),

      // On subscription before skipUntil emmited, subscriber would get nothing.
      // We prefere subscriber to get an initial value, this value being the current aggregator value
      ensureInitial(() => aggregator.value),

      // if event does not lead to a new state, we don't want to emit
      distinctUntilChanged(),
    )

    // We don't return directly subscription because user is not aware it's an observable under the hood
    // For user, the request is to connect an aggregator, it should return a function to disconnect it
    projection$.connect = () => simpleUnsub(event$.subscribe(aggregator))

    return setValueGetter(projection$, aggregator.getValue)
  }).get
