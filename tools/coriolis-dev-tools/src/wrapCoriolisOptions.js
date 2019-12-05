import { Subject } from 'rxjs'

import {
  createAggregator,
  createAggregatorFactory,
  withSimpleStoreSignature,
} from 'coriolis'

import { createCoriolisDevToolsEffect } from './effect'

import {
  aggregatorCreated,
  aggrSetup,
  aggrCalled,
  aggregatorCalled,
} from './events'
import { lossless } from './lib/rx/operator/lossless'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

let lastAggrId = 0
const getAggrId = () => ++lastAggrId

const getAggrName = aggr => {
  try {
    let foundName
    aggr({
      useState: () => {},
      useEvent: () => {},
      useAggr: () => {},
      lazyAggr: () => {},
      useValue: () => {},
      setName: name => {
        foundName = name
      },
    })

    return foundName || aggr.name
  } catch (error) {
    return aggr.name
  }
}

const createTrackingAggregatorFactory = (storeId, trackingSubject) => (
  aggr,
  getAggregator,
) => {
  const aggrId = getAggrId()
  const aggrName = getAggrName(aggr)

  if (aggrName !== aggr.name) {
    Object.defineProperty(aggr, 'name', {
      value: aggrName,
      writable: false,
    })
  }

  const aggrBehaviorWrapper = aggrBehavior => (...args) => {
    const newState = aggrBehavior(...args)
    trackingSubject.next(aggrCalled({ storeId, aggrId, args, newState }))

    return newState
  }

  const wrappedAggr = (...args) => {
    if (
      args.length === 1 &&
      (args[0].useAggr ||
        args[0].useEvent ||
        args[0].useState ||
        args[0].lazyAggr ||
        args[0].useValue)
    ) {
      let aggrBehavior
      let shouldThrow = false

      try {
        aggrBehavior = aggr(...args)
      } catch (error) {
        shouldThrow = true
        aggrBehavior = error
      }

      trackingSubject.next(aggrSetup({ storeId, aggrId, aggrBehavior }))

      // result is not expected type.... maybe this was not a complex aggr but a reducer... return what we got
      if (typeof aggrBehavior !== 'function') {
        if (shouldThrow) {
          throw aggrBehavior
        }

        return aggrBehavior
      }

      return aggrBehaviorWrapper(aggrBehavior)
    }

    const newState = aggr(...args)
    trackingSubject.next(aggrCalled({ storeId, aggrId, args, newState }))

    return newState
  }

  Object.defineProperty(wrappedAggr, 'name', {
    value: aggrName,
    writable: false,
  })

  Object.defineProperty(wrappedAggr, 'length', {
    value: aggr.length,
    writable: false,
  })

  const aggregator = createAggregator(wrappedAggr, getAggregator)

  trackingSubject.next(aggregatorCreated({ storeId, aggrId, aggr, aggregator }))

  const wrappedAggregator = event => {
    trackingSubject.next(aggregatorCalled({ storeId, aggrId, event }))
    return aggregator(event)
  }

  wrappedAggregator.getValue = aggregator.getValue

  Object.defineProperty(wrappedAggregator, 'value', {
    configurable: false,
    enumerable: true,
    get: aggregator.getValue,
  })

  return wrappedAggregator
}

export const wrapCoriolisOptions = withSimpleStoreSignature(
  (options, ...effects) => {
    const storeId = getStoreId()
    const aggregatorEvents = new Subject()

    const devtoolsEffect = createCoriolisDevToolsEffect(
      storeId,
      options.storeName,
      aggregatorEvents.pipe(lossless),
    )

    options.effects = [devtoolsEffect, ...effects]

    options.aggregatorFactory = createAggregatorFactory(
      createTrackingAggregatorFactory(storeId, aggregatorEvents),
    )

    return options
  },
)
