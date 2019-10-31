import { EMPTY } from 'rxjs'

import { createStore, snapshot } from 'coriolis'

import { createUI } from './effects/ui'
import { storeEvent, storeAdded } from './events'

let destroyDevtoolsStore
const initDevtoolsEventStore = () => {
  let devtoolsEventSource

  destroyDevtoolsStore = createStore(
    createUI(),
    ({ eventSource }) => {
      devtoolsEventSource = eventSource
    }
  )

  return (storeId, storeName = 'unnamed', aggregatorEvents = EMPTY) =>
    ({ eventSource, initialEvent$, withAggr }) => {
      devtoolsEventSource.next(storeAdded({
        storeId,
        storeName,
        snapshot$: withAggr(snapshot)
      }))

      const aggregatorEventsSubscription = aggregatorEvents.subscribe(event => devtoolsEventSource.next(event))
      const initialEventsSubscription = initialEvent$.subscribe(event => devtoolsEventSource.next(storeEvent({ storeId, event, isInitialEvent: true })))
      const eventsSubscription = eventSource.subscribe(event => devtoolsEventSource.next(storeEvent({ storeId, event })))

      return () => {
        aggregatorEventsSubscription.unsubscribe()
        initialEventsSubscription.unsubscribe()
        eventsSubscription.unsubscribe()
      }
    }
  }

let createDevtoolsEffect
export const createCoriolisDevToolsEffect = (...args) => {
  if (!createDevtoolsEffect) {
    createDevtoolsEffect = initDevtoolsEventStore()
  }

  return createDevtoolsEffect(...args)
}

export const disableCoriolisDevTools = () => destroyDevtoolsStore && destroyDevtoolsStore()
