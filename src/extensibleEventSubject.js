import { from } from 'rxjs'
import { endWith } from 'rxjs/operators'

import { createBroadcastSubject } from './lib/rx/broadcastSubject'
import { createExtensibleObservable } from './lib/rx/extensibleObservable'
import { variableFunction } from './lib/function/variableFunction'
import { payloadEquals } from './lib/event/payloadEquals'

import { createEventSubject } from './eventSubject'

export const FIRST_EVENT_TYPE = 'All past events have been read'

const buildFirstEvent = () => ({
  type: FIRST_EVENT_TYPE,
  // a payload is important to check this event. Event itself will be changed (adding meta etc.)
  payload: {},
})

// An extensible eventSubject is an eventSubject with additional functions to add sources and loggers
// TODO: maybe it could be usefull to be able to add eventEnhancers too
export const createExtensibleEventSubject = (eventEnhancer) => {
  const {
    broadcastSubject: logger,
    addTarget: addLogger,
  } = createBroadcastSubject()

  const {
    observable: pastSource,
    add: addPastSource,
  } = createExtensibleObservable()

  const addAnyAsPastSource = (source) => addPastSource(from(source))

  const firstEvent = buildFirstEvent()
  const isFirstEvent = payloadEquals(firstEvent.payload)

  const {
    func: fusableAddPastSource,
    setup: changeFusableAddPastSource,
  } = variableFunction(addAnyAsPastSource)

  const disableAddPastSource = () =>
    changeFusableAddPastSource(() => {
      throw new Error('addSource must be called before all sources completed')
    })

  // From the moment this event source is created, it starts buffering all events it receives
  // until it gets a subscription and passes them
  const eventSubject = createEventSubject(
    pastSource.pipe(endWith(firstEvent)),
    logger,
    eventEnhancer,
  )

  return {
    eventSubject,
    addLogger,
    addSource: fusableAddPastSource,
    disableAddSource: disableAddPastSource,
    isFirstEvent,
  }
}
