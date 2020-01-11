import { Subject } from 'rxjs'

import {
  createAggregator,
  createAggregatorFactory,
  withSimpleStoreSignature,
} from 'coriolis'

import { createCoriolisDevToolsEffect } from './effect'

import {
  aggregatorCreated,
  projectionSetup,
  projectionCalled,
  aggregatorCalled,
} from './events'
import { lossless } from './lib/rx/operator/lossless'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

let lastprojectionId = 0
const getprojectionId = () => ++lastprojectionId

const getProjectionName = projection => {
  try {
    let foundName
    projection({
      useState: () => {},
      useEvent: () => {},
      useProjection: () => {},
      lazyProjection: () => {},
      useValue: () => {},
      setName: name => {
        foundName = name
      },
    })

    return foundName || projection.name
  } catch (error) {
    return projection.name
  }
}

const createTrackingAggregatorFactory = (storeId, trackingSubject) => (
  projection,
  getAggregator,
) => {
  const projectionId = getprojectionId()
  const projectionName = getProjectionName(projection)
  let aggregator

  if (projectionName !== projection.name) {
    Object.defineProperty(projection, 'name', {
      value: projectionName,
      writable: false,
    })
  }

  const projectionBehaviorWrapper = projectionBehavior => (...args) => {
    const newState = projectionBehavior(...args)
    if (aggregator) {
      // During aggregator creation, this projectionBehaviour wrapper can be called to get initial state
      // this initial call is not triggered by an event, so we don't track it as an projectionCalled event
      //
      // TODO: maybe we could track this with an event like "projectionInitialStateCall"
      trackingSubject.next(projectionCalled({ storeId, projectionId, args, newState }))
    }

    return newState
  }

  const wrappedProjection = (...args) => {
    if (
      args.length === 1 &&
      (args[0].useProjection ||
        args[0].useEvent ||
        args[0].useState ||
        args[0].lazyProjection ||
        args[0].useValue)
    ) {
      let projectionBehavior
      let shouldThrow = false

      try {
        projectionBehavior = projection(...args)
      } catch (error) {
        shouldThrow = true
        projectionBehavior = error
      }

      trackingSubject.next(projectionSetup({ storeId, projectionId, projectionBehavior }))

      // result is not expected type.... maybe this was not a complex projection but a reducer... return what we got
      if (typeof projectionBehavior !== 'function') {
        if (shouldThrow) {
          throw projectionBehavior
        }

        return projectionBehavior
      }

      return projectionBehaviorWrapper(projectionBehavior)
    }

    const newState = projection(...args)
    if (aggregator) {
      // During aggregator creation, this projection wrapper can be called to get initial state
      // this initial call is not triggered by an event, so we don't track it as an projectionCalled event
      //
      // TODO: maybe we could track this with an event like "projectionInitialStateCall"
      trackingSubject.next(projectionCalled({ storeId, projectionId, args, newState }))
    }

    return newState
  }

  Object.defineProperty(wrappedProjection, 'name', {
    value: projectionName,
    writable: false,
  })

  Object.defineProperty(wrappedProjection, 'length', {
    value: projection.length,
    writable: false,
  })

  aggregator = createAggregator(wrappedProjection, getAggregator)

  trackingSubject.next(aggregatorCreated({ storeId, projectionId, projection, aggregator }))

  const wrappedAggregator = event => {
    trackingSubject.next(aggregatorCalled({ storeId, projectionId, event }))
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
