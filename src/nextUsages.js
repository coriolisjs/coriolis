import { interval } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { createStore } from './eventStore'

// Aggrs

const countEventsAggr = ({ useState }) => (
  useState(),
  (count = 0) => console.log(' -> countEvents') || count + 1
)

const listEventsAggr = ({ useState, useEvent }) => (
  useState(),
  useEvent(),
  (list = [], event) => console.log(' -> listEvents') || [...list, event]
)

const listEventNames = ({ useAggr }) => (
  useAggr(listEventsAggr),
  eventList => eventList.map(({ type }) => type)
)

createStore(
  ({ eventSource, pipeAggr }) =>
    pipeAggr(countEventsAggr)
      .subscribe(data => console.log('events count', data))
      .add(
        interval(1000)
          .pipe(
            map(event => ({ type: 'effect1 event', payload: event })),
            tap(event => console.log('🎉 emits effect1 event', event))
          )
          .subscribe(eventSource)
      ),
  ({ eventSource, pipeAggr }) =>
    pipeAggr(listEventNames)
      .subscribe(data => console.log('eventnames list', data))
      .add(
        pipeAggr(listEventsAggr)
          .subscribe(data => console.log('events list', data))
      )
      .add(
        interval(600)
          .pipe(
            map(event => ({ type: 'effect2 event', payload: event })),
            tap(event => console.log('🎉 emits effect2 event', event))
          )
          .subscribe(eventSource)
      )
)
