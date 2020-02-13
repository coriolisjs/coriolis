import { EMPTY } from 'rxjs'

import { createStore, snapshot } from '@coriolis/coriolis'

import { storage } from './effects/storage'
import { createUI } from './effects/ui'
import { storeEvent, storeAdded } from './events'

let destroyDevtoolsStore
const initDevtoolsEventStore = () => {
  let devtoolsDispatchEvent

  destroyDevtoolsStore = createStore(
    createUI(),
    storage,
    ({ dispatchEvent }) => {
      devtoolsDispatchEvent = dispatchEvent
    },
  )

  return (storeId, storeName = 'unnamed', aggregatorEvents = EMPTY) => ({
    event$,
    pastEvent$,
    withProjection,
  }) => {
    devtoolsDispatchEvent(
      storeAdded({
        storeId,
        storeName,
        snapshot$: withProjection(snapshot),
      }),
    )

    const aggregatorEventsSubscription = aggregatorEvents.subscribe(event =>
      devtoolsDispatchEvent(event),
    )
    const pastEventsSubscription = pastEvent$.subscribe(event =>
      devtoolsDispatchEvent(storeEvent({ storeId, event, isPastEvent: true })),
    )
    const eventsSubscription = event$.subscribe(event =>
      devtoolsDispatchEvent(storeEvent({ storeId, event })),
    )

    return () => {
      aggregatorEventsSubscription.unsubscribe()
      pastEventsSubscription.unsubscribe()
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

export const disableCoriolisDevTools = () =>
  destroyDevtoolsStore && destroyDevtoolsStore()
