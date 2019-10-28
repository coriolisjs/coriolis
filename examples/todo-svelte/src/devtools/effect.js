import { EMPTY } from 'rxjs'

import { createStore } from 'coriolis'

import { createUI } from './effects/ui'
import { createNav } from './effects/nav'
import { eventStoreEvent, eventStoreAdded } from './events'

import { viewNames } from './components/views'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

const initDevtoolsEventStore = () => {
  let devtoolsEventSource

  createStore(
    createUI(),
    createNav(viewNames),
    ({ eventSource }) => {
    devtoolsEventSource = eventSource
  })

  createDevtoolsEffect = (storeName = 'unnamed', aggregatorEvents = EMPTY) => ({ eventSource, initialEvent$ }) => {
    const storeId = getStoreId()

    devtoolsEventSource.next(eventStoreAdded({ storeId, storeName }))

    const aggregatorEventsSubscription = aggregatorEvents.subscribe(event => devtoolsEventSource.next(event))
    const initialEventsSubscription = initialEvent$.subscribe(event => devtoolsEventSource.next(eventStoreEvent({ storeId, event })))
    const eventsSubscription = eventSource.subscribe(event => devtoolsEventSource.next(eventStoreEvent({ storeId, event })))

    return () => {
      aggregatorEventsSubscription.unsubscribe()
      initialEventsSubscription.unsubscribe()
      eventsSubscription.unsubscribe()
    }
  }

  return createDevtoolsEffect
}

let createDevtoolsEffect
export const createCoriolisDevToolsEffect = aggregatorEvents => {
  if (!createDevtoolsEffect) {
    createDevtoolsEffect = initDevtoolsEventStore()
  }

  return createDevtoolsEffect(aggregatorEvents)
}
