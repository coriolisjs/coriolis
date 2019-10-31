import { Subject } from 'rxjs'

import { createAggregator, createAggregatorFactory } from 'coriolis'

import { createCoriolisDevToolsEffect } from './effect'

import { devtoolsAggregatorCreated, devtoolsAggrCalled, devtoolsAggregatorCalled } from './events'
import { lossless } from '../../../../src/lib/rx/operator/lossless'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

export const wrapCoriolisOptions = (_options, ...rest) => {
  let options = _options
  let effects
  if (typeof options === 'function') {
    effects = [options, ...rest]
    options = {}
  } else if (options.effects && Array.isArray(options.effects)) {
    effects = [...options.effects, ...rest]
  } else {
    effects = rest
  }

  const storeId = getStoreId()
  const aggregatorEvents = new Subject()

  const devtoolsEffect = createCoriolisDevToolsEffect(storeId, options.storeName, aggregatorEvents.pipe(lossless))

  options.effects = [devtoolsEffect, ...effects]

  options.aggregatorFactory = createAggregatorFactory((aggr, getAggregator) => {
    aggregatorEvents.next(devtoolsAggregatorCreated({ storeId, aggr }))

    const wrappedaggr = (...args) => {
      aggregatorEvents.next(devtoolsAggrCalled({ storeId, aggr }))
      return aggr(...args)
    }

    const aggregator = createAggregator(wrappedaggr, getAggregator)

    return event => {
      aggregatorEvents.next(devtoolsAggregatorCalled({ storeId, aggr }))
      return aggregator(event)
    }
  })

  return options
}
