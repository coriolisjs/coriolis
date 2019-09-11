import { from, interval } from 'rxjs'
import { take } from 'rxjs/operators'

import { createExtensibleObservable } from './extensibleObservable'
console.log('starts')
const {
  observable,
  add
} = createExtensibleObservable()

observable.subscribe(
  event => console.log('before add event', event),
  error => console.log('before add error', error),
  _ => console.log('before add complete')
)

add(interval(1000).pipe(take(3)))

observable.subscribe(
  event => console.log('first event', event),
  error => console.log('first error', error),
  _ => console.log('first complete')
)

setTimeout(() => {
  add(interval(100).pipe(take(4)))
  const removeSource = add(interval(1000).pipe(take(10)))

  setTimeout(() => {
    removeSource()

    add(from(['a', 'b', 'c']))

    setTimeout(() => {
      observable.subscribe(
        event => console.log('second event', event),
        error => console.log('second error', error),
        _ => console.log('second complete')
      )
    }, 100)
  }, 7000)
}, 2500)
