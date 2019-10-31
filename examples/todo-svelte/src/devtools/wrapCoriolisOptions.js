import { Subject } from 'rxjs'

import { createAggregator, createAggregatorFactory } from 'coriolis'

import { createCoriolisDevToolsEffect } from './effect'

import { devtoolsAggregatorCreated, devtoolsAggrSetup, devtoolsAggrCalled, devtoolsAggregatorCalled } from './events'
import { lossless } from '../../../../src/lib/rx/operator/lossless'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

let lastAggrId = 0
const getAggrId = () => ++lastAggrId

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
    const aggrId = getAggrId()
    aggregatorEvents.next(devtoolsAggregatorCreated({ storeId, aggrId, aggr }))

    const aggrBehaviorWrapper = aggrBehavior => (...args) => {
      aggregatorEvents.next(devtoolsAggrCalled({ storeId, aggrId, args }))
      return aggrBehavior(...args)
    }

    const wrappedaggr = (...args) => {
      if (args.length === 1 && (args[0].useAggr || args[0].useEvent || args[0].useState)) {
        let aggrBehavior
        let shouldThrow = false

        try {
          aggrBehavior = aggr(...args)
        } catch(error) {
          shouldThrow = true
          aggrBehavior = error
        }

        aggregatorEvents.next(devtoolsAggrSetup({ storeId, aggrId, aggrBehavior }))

        if (typeof aggrBehavior !== 'function') {
          if (shouldThrow) {
            throw aggrBehavior
          }

          return aggrBehavior
        }

        return aggrBehaviorWrapper(aggrBehavior)
      }

      aggregatorEvents.next(devtoolsAggrCalled({ storeId, aggrId, args }))
      return aggr(...args)
    }

    Object.defineProperty(wrappedaggr, 'name', {
      value: aggr.name,
      writable: false
    })

    Object.defineProperty(wrappedaggr, 'length', {
      value: aggr.length,
      writable: false
    })

    const aggregator = createAggregator(wrappedaggr, getAggregator)

    return event => {
      aggregatorEvents.next(devtoolsAggregatorCalled({ storeId, aggrId, event }))
      return aggregator(event)
    }
  })

  return options
}
