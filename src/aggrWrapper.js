import {
  of
} from 'rxjs'
import {
  distinctUntilChanged,
  map,
  skipUntil
} from 'rxjs/operators'

import { createAggregator } from './aggregator'

import { createIndex } from './lib/map/objectIndex'
import { objectFrom } from './lib/object/objectFrom'
import { simpleUnsub } from './lib/rx/simpleUnsub'

export const snapshot = () => {}

export const createAggrWrapperFactory = (event$, skipUntil$ = of(true), aggregatorBuilder = createAggregator) => {
  const {
    get: getAggregator,
    list: listAggregators
  } = createIndex(aggr => aggr === snapshot
    ? getSnapshot
    : aggregatorBuilder(aggr, getAggregator))

  // to build a snapshot, we get the current state from each aggregator and put
  // all this in an object, using aggregator definition's name as keys. If any conflicts
  // on names, numbers are concatenated on conflicting keys (aKey, aKey-2, aKey-3...)
  const getSnapshot = () => objectFrom(
    listAggregators()
      .filter(([aggr]) => aggr !== snapshot)
      .map(([aggr, aggregator]) => [aggr.name, aggregator()])
  )

  const {
    get: getAggrWrapper,
    list: listAggrWrappers
  } = createIndex(aggr => {
    const aggregator = getAggregator(aggr)

    const aggr$ = event$.pipe(
      map(aggregator),

      // while init is not finished (old events replaying), we expect aggrs to
      // catch all events, but we don't want any new state emited (it's not new states, it's old state reaggregated)
      skipUntil(skipUntil$),

      // if event does not lead to a new aggregate, we don't want to emit
      distinctUntilChanged()
    )

    // We don't return directly subscription because user is not aware it's an observable under the hood
    // For user, the request is to connect an aggregator, it should return a function to disconnect it
    aggr$.connect = () => simpleUnsub(event$.subscribe(aggregator))

    aggr$.getValue = () => aggregator()

    Object.defineProperty(aggr$, 'value', {
      configurable: false,
      enumerable: true,
      get: aggr$.getValue
    })

    return aggr$
  })

  return {
    getAggrWrapper,
    listAggrWrappers
  }
}
