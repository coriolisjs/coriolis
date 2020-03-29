import { from } from 'rxjs'
import { endWith } from 'rxjs/operators'

import { createBroadcastSubject } from './lib/rx/broadcastSubject'
import { createExtensibleObservable } from './lib/rx/extensibleObservable'
import { variableFunction } from './lib/function/variableFunction'

import { createEventSubject } from './eventSubject'

export const FIRST_EVENT_TYPE = 'All past events have been read'

const buildFirstEvent = () => ({
  type: FIRST_EVENT_TYPE,
  payload: {},
})

export const createExtensibleEventSubject = (eventEnhancer) => {
  const firstEvent = buildFirstEvent()

  const {
    broadcastSubject: logger,
    addTarget: addLogger,
  } = createBroadcastSubject()

  const {
    observable: mainSource,
    add: addSourceToMainSource,
  } = createExtensibleObservable()

  const {
    func: addSource,
    setup: setupAddSource,
  } = variableFunction((source) => addSourceToMainSource(from(source)))

  const disableAddSource = () =>
    setupAddSource(() => {
      throw new Error('addSource must be called before all sources completed')
    })

  // From the moment this event source is created, it starts buffering all events it receives
  // until it gets a subscription and passes them
  const eventSubject = createEventSubject(
    mainSource.pipe(endWith(firstEvent)),
    logger,
    eventEnhancer,
  )

  return {
    eventSubject,
    addLogger,
    addSource,
    disableAddSource,
    firstEvent,
  }
}
