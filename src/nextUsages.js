import { interval } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { createStore } from './eventStore'

// reducers

const countEventsReducer = (count = 0) => console.log(' -> countEvents') || count + 1

const listEventsReducer = (list = [], event) => console.log(' -> listEvents') || [...list, event]

const listEventNames = (_, __, useReducer) => {
  const getEventList = useReducer(listEventsReducer)

  return getEventList().map(({ type }) => type)
}

createStore(
  ({ eventSource, pipeReducer }) =>
    pipeReducer(countEventsReducer)
      .subscribe(data => console.log('events count', data))
      .add(
        interval(1000)
          .pipe(
            map(event => ({ type: 'effect1 event', payload: event })),
            tap(event => console.log('🎉 emits effect1 event', event))
          )
          .subscribe(eventSource)
      ),
  ({ eventSource, pipeReducer }) =>
    pipeReducer(listEventNames)
      .subscribe(data => console.log('eventnames list', data))
      .add(
        pipeReducer(listEventsReducer)
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
