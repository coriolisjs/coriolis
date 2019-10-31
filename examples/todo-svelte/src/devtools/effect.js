import { EMPTY } from 'rxjs'

import { createStore } from 'coriolis'

import { createUI } from './effects/ui'
import { createNav } from './effects/nav'
import { eventStoreEvent, eventStoreAdded } from './events'

import { viewNames } from './components/views'

const initDevtoolsEventStore = () => {
  let devtoolsEventSource

  createStore(
    createUI(),
    createNav(viewNames),
    ({ eventSource }) => {
      devtoolsEventSource = eventSource
    }
  )

  return (storeId, storeName = 'unnamed', aggregatorEvents = EMPTY) =>
    ({ eventSource, initialEvent$ }) => {
      devtoolsEventSource.next(eventStoreAdded({
        storeId,
        storeName
      }))

      const aggregatorEventsSubscription = aggregatorEvents.subscribe(event => devtoolsEventSource.next(event))
      const initialEventsSubscription = initialEvent$.subscribe(event => devtoolsEventSource.next(eventStoreEvent({ storeId, event })))
      const eventsSubscription = eventSource.subscribe(event => devtoolsEventSource.next(eventStoreEvent({ storeId, event })))

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
