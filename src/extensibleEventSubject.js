import { from } from 'rxjs'
import { endWith } from 'rxjs/operators'

import { createBroadcastSubject } from './lib/rx/broadcastSubject'
import { createExtensibleObservable } from './lib/rx/extensibleObservable'
import { createExtensibleOperator } from './lib/rx/operator/extensibleOperator'
import { variableFunction } from './lib/function/variableFunction'
import { payloadEquals } from './lib/event/payloadEquals'

import { createEventSubject } from './eventSubject'

export const FIRST_EVENT_TYPE = 'All past events have been read'

const buildFirstEvent = () => ({
  type: FIRST_EVENT_TYPE,
  // a payload is important to check this event. Event itself will be changed (adding meta etc.)
  payload: {},
})

// An extensible eventSubject is an eventSubject with additional functions to add sources, loggers and eventEnhancers
export const createExtensibleEventSubject = () => {
  const {
    broadcastSubject: logger,
    addTarget: addLogger,
  } = createBroadcastSubject()

  const {
    observable: pastSource,
    add: addPastSource,
  } = createExtensibleObservable()

  const {
    operator: eventEnhancer,
    add: addEventEnhancer,
  } = createExtensibleOperator()

  const {
    operator: pastEventEnhancer,
    add: addPastEventEnhancer,
  } = createExtensibleOperator()

  const addAnyAsPastSource = (source) => addPastSource(from(source))

  const {
    func: fusableAddPastSource,
    setup: changeFusableAddPastSource,
  } = variableFunction(addAnyAsPastSource)

  const disableAddPastSource = () =>
    changeFusableAddPastSource(() => {
      throw new Error('addSource must be called before all sources completed')
    })

  const firstEvent = buildFirstEvent()
  // Check is done on payload value, event object itself
  // would have been changed (adding meta-data for example)
  const isFirstEvent = payloadEquals(firstEvent.payload)

  // From the moment this event source is created, it starts buffering all events it receives
  // until it gets a subscription and passes them
  const eventSubject = createEventSubject(
    pastSource.pipe(endWith(firstEvent)),
    logger,
    eventEnhancer,
    pastEventEnhancer,
  )

  return {
    eventSubject,
    addLogger,
    addSource: fusableAddPastSource,
    addEventEnhancer,
    addPastEventEnhancer,
    disableAddSource: disableAddPastSource,
    isFirstEvent,
  }
}
