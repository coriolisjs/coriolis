import { Subject } from 'rxjs'

import { createAggregator, createAggregatorFactory } from 'coriolis'

import { createCoriolisDevToolsEffect } from './effect'

import { devtoolsAggregatorCreated, devtoolsAggrCalled, devtoolsAggregatorCalled } from './events'
import { lossless } from '../../../../src/lib/rx/operator/lossless'

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

  const aggregatorEvents = new Subject()

  const devtoolsEffect = createCoriolisDevToolsEffect(aggregatorEvents.pipe(lossless))

  options.effects = [devtoolsEffect, ...effects]

  options.aggregatorFactory = createAggregatorFactory((aggr, getAggregator) => {
    aggregatorEvents.next(devtoolsAggregatorCreated(aggr))

    const wrappedaggr = (...args) => {
      aggregatorEvents.next(devtoolsAggrCalled(aggr))
      return aggr(...args)
    }

    const aggregator = createAggregator(wrappedaggr, getAggregator)

    return event => {
      aggregatorEvents.next(devtoolsAggregatorCalled(aggr))
      return aggregator(event)
    }
  })

  return options
}