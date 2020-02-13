import { EMPTY } from 'rxjs'

import { createStore, snapshot } from '@coriolis/coriolis'

import { storage } from './effects/storage'
import { createUI } from './effects/ui'
import { storeEvent, storeAdded } from './events'

let destroyDevtoolsStore
const initDevtoolsEventStore = () => {
  let devtoolsEventSubject

  destroyDevtoolsStore = createStore(
    createUI(),
    storage,
    ({ eventSubject }) => {
      devtoolsEventSubject = eventSubject
    },
  )

  return (storeId, storeName = 'unnamed', aggregatorEvents = EMPTY) => ({
    eventSubject,
    pastEvent$,
    withProjection,
  }) => {
    devtoolsEventSubject.next(
      storeAdded({
        storeId,
        storeName,
        snapshot$: withProjection(snapshot),
      }),
    )

    const aggregatorEventsSubscription = aggregatorEvents.subscribe(event =>
      devtoolsEventSubject.next(event),
    )
    const pastEventsSubscription = pastEvent$.subscribe(event =>
      devtoolsEventSubject.next(
        storeEvent({ storeId, event, isPastEvent: true }),
      ),
    )
    const eventsSubscription = eventSubject.subscribe(event =>
      devtoolsEventSubject.next(storeEvent({ storeId, event })),
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
