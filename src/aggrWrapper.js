import {
  of
} from 'rxjs'
import {
  distinctUntilChanged,
  map,
  skipUntil
} from 'rxjs/operators'

import { createIndex } from './lib/map/objectIndex'
import { simpleUnsub } from './lib/rx/simpleUnsub'
import { ensureInitial } from './lib/rx/operator/ensureInitial'

import { createAggregatorFactory } from './aggregator'

export const createAggrWrapperFactory = (
  event$,
  skipUntil$ = of(true),
  getAggregator = createAggregatorFactory()
) =>
  createIndex(aggr => {
    const aggregator = getAggregator(aggr)

    const aggr$ = event$.pipe(
      map(aggregator),

      // while init is not finished (old events replaying), we expect aggrs to
      // catch all events, but we don't want any new state emited (it's not new states, it's old state reaggregated)
      skipUntil(skipUntil$),

      ensureInitial(() => aggregator.value),

      // if event does not lead to a new aggregate, we don't want to emit
      distinctUntilChanged()
    )

    // We don't return directly subscription because user is not aware it's an observable under the hood
    // For user, the request is to connect an aggregator, it should return a function to disconnect it
    aggr$.connect = () => simpleUnsub(event$.subscribe(aggregator))

    aggr$.getValue = aggregator.getValue

    Object.defineProperty(aggr$, 'value', {
      configurable: false,
      enumerable: true,
      get: aggregator.getValue
    })

    return aggr$
  }).get
