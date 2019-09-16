import { interval, zip } from 'rxjs'
import { map, take, tap, share } from 'rxjs/operators'

import { createStore } from './eventStore'

console.log('start')

const initialSource = interval(100).pipe(
  take(3),
  map(event => ({ type: 'stored event', payload: event })),
  tap(event => console.log('🎉 emits stored event', event)),
  share()
)

const logObserver = event => console.log('✍ ', event)

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

const listEventsNames = ({ useAggr }) => (
  useAggr(listEventsAggr),
  eventList => eventList.map(({ type }) => type)
)

const listSameEventsAggr = ({ useEvent, useAggr }) => (
  useEvent(),
  useAggr(listEventsAggr),
  useAggr(listEventsNames),
  (event, eventList, eventNamesList) =>
    console.log(' -> listEvents of type', event.type, eventNamesList) ||
    eventList.filter(({ type }) => type === event.type)
)

const lastEvenEvent = ({ useState, useEvent }) => (
  useState(),
  useEvent(),
  (state, event) => console.log(' -> get last even event') || (event.payload % 2 ? event : state)
)

const lastEvent = ({ useEvent }) => (
  useEvent(),
  event => event
)

// effects

const effect0 = ({ addSource, addLogger }) => {
  console.log('setup effect0')
  const removeLogger = addLogger(logObserver)
  const removeSource = addSource(initialSource)

  return () => {
    removeLogger()
    removeSource()
  }
}

const effect1 = ({ eventSource, pipeAggr }) => console.log('setup effect1') ||
  zip(
    pipeAggr(lastEvent),
    pipeAggr(listEventsAggr)
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

const effect2 = ({ eventSource, pipeAggr }) => console.log('setup effect2') ||
  zip(
    pipeAggr(lastEvent),
    pipeAggr(countEventsAggr),
    pipeAggr(listEventsAggr)
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

const effect3 = ({ eventSource, pipeAggr }) => console.log('setup effect3') ||
  pipeAggr(listSameEventsAggr)
    .subscribe(event => console.log('effect3 received', event))
    .add(
      interval(10000)
        .pipe(
          map(event => ({ type: 'effect3 event', payload: event })),
          tap(event => console.log('🎉 emits effect3 event', event))
        )
        .subscribe(eventSource)
    )

const effect4 = ({ eventSource, pipeAggr }) => console.log('setup effect4') ||
  pipeAggr(lastEvenEvent)
    .subscribe(event => console.log('effect4 received', event))
    .add(
      interval(10000)
        .pipe(
          map(event => ({ type: 'effect4 event', payload: event })),
          tap(event => console.log('🎉 emits effect4 event', event))
        )
        .subscribe(eventSource)
    )

const effect5 = ({ eventSource, pipeAggr }) => console.log('setup effect5') ||
  pipeAggr(lastEvenEvent)
    .subscribe(data => console.log('effect5 received', data))
    .add(
      interval(11000)
        .pipe(
          map(event => ({ type: 'effect5 event', payload: event })),
          tap(event => console.log('🎉 emits effect5 event', event))
        )
        .subscribe(eventSource)
    )

const effect7 = ({ eventSource, addSource }) => {
  console.log('setup effect7')
  const removeSource = addSource([{ type: 'other stored event' }])

  return eventSource.subscribe(event => console.log('effect7 received', event))
    .add(removeSource)
}

const effect6 = ({ eventSource, pipeAggr, addEffect }) => {
  console.log('setup effect6')
  const removeEffect = addEffect(effect7)

  return pipeAggr(lastEvenEvent).subscribe(data => console.log('effect6 received', data))
    .add(removeEffect)
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