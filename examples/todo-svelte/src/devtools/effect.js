import { EMPTY } from 'rxjs'

import { createStore } from 'coriolis'

import { createUI } from './effects/ui'
import { createNav } from './effects/nav'
import { eventStoreEvent } from './events'

import { viewNames } from './components/views'

const initDevtoolsEventStore = () => {
  let devtoolsEventSource

  createStore(
    createUI(),
    createNav(viewNames),
    ({ eventSource }) => {
    devtoolsEventSource = eventSource
  })

  createDevtoolsEffect = (aggregatorEvents = EMPTY) => ({ eventSource, initialEvent$ }) => {
    const aggregatorEventsSubscription = aggregatorEvents.subscribe(event => devtoolsEventSource.next(event))
    const initialEventsSubscription = initialEvent$.subscribe(event => devtoolsEventSource.next(eventStoreEvent(event)))
    const eventsSubscription = eventSource.subscribe(event => devtoolsEventSource.next(eventStoreEvent(event)))

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
