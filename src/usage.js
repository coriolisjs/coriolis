import { interval, zip } from 'rxjs'
import { map, take, tap, share } from 'rxjs/operators'

import { createStore } from './eventStore'

const initialSource = interval(100).pipe(
  take(3),
  map(event => ({ type: 'stored event', payload: event })),
  tap(event => console.log('🎉 emits stored event', event)),
  share()
)

const logObserver = event => console.log('✍ ', event)

// reducers

const countEventsReducer = (count = 0) => console.log(' -> countEvents') || count + 1

const listEventsReducer = (list = [], event) => console.log(' -> listEvents') || [...list, event]

const listEventsNames = (_, __, useReducer) => {
  const getEventList = useReducer(listEventsReducer)

  return getEventList().map(({ type }) => type)
}

const listSameEventsReducer = (_, event, useReducer) => {
  const getEventList = useReducer(listEventsReducer)
  const getEventNameList = useReducer(listEventsNames)

  console.log(' -> listEvents of type', event.type, getEventNameList())
  return getEventList().filter(({ type }) => type === event.type)
}

const lastEvenEvent = (state, event) => console.log(' -> get last even event') || (event.payload % 2 ? event : state)

const lastEvent = (_, event) => event

// effects

const effect0 = ({ pipeSource, pipeLogger }) =>
  pipeSource(initialSource)
    .add(pipeLogger(logObserver))

const effect1 = ({ eventSource, pipeReducer }) =>
  zip(
    pipeReducer(lastEvent),
    pipeReducer(listEventsReducer)
  )
    .subscribe(event => console.log('effect1 received', event))
    .add(
      interval(1000)
        .pipe(
          map(event => ({ type: 'effect1 event', payload: event })),
          tap(event => console.log('🎉 emits effect1 event', event))
        )
        .subscribe(eventSource)
    )

const effect2 = ({ eventSource, pipeReducer }) =>
  zip(
    pipeReducer(lastEvent),
    pipeReducer(countEventsReducer),
    pipeReducer(listEventsReducer)
  )
    .subscribe(event => console.log('effect2 received', event))
    .add(
      interval(3000)
        .pipe(
          map(event => ({ type: 'effect2 event', payload: event })),
          tap(event => console.log('🎉 emits effect2 event', event))
        )
        .subscribe(eventSource)
    )

const effect3 = ({ eventSource, pipeReducer }) =>
  pipeReducer(listSameEventsReducer)
    .subscribe(event => console.log('effect3 received', event))
    .add(
      interval(10000)
        .pipe(
          map(event => ({ type: 'effect3 event', payload: event })),
          tap(event => console.log('🎉 emits effect3 event', event))
        )
        .subscribe(eventSource)
    )

const effect4 = ({ eventSource, pipeReducer }) =>
  pipeReducer(lastEvenEvent)
    .subscribe(event => console.log('effect4 received', event))
    .add(
      interval(10000)
        .pipe(
          map(event => ({ type: 'effect4 event', payload: event })),
          tap(event => console.log('🎉 emits effect4 event', event))
        )
        .subscribe(eventSource)
    )

const effect5 = ({ eventSource, pipeReducer }) =>
  pipeReducer(lastEvenEvent)
    .subscribe(data => console.log('effect5 received', data))
    .add(
      interval(11000)
        .pipe(
          map(event => ({ type: 'effect5 event', payload: event })),
          tap(event => console.log('🎉 emits effect5 event', event))
        )
        .subscribe(eventSource)
    )

const effect6 = ({ eventSource, pipeReducer }) => {
  return pipeReducer(lastEvenEvent).subscribe(data => console.log('effect6 received', data))
    .add(
      interval(11000)
        .pipe(
          map(event => ({ type: 'effect6 event', payload: event })),
          tap(event => console.log('🎉 emits effect6 event', event))
        )
        .subscribe(eventSource)
    )
}

createStore(
  effect0,
  effect1,
  effect2,
  effect3,
  effect4,
  effect5,
  effect6
)
