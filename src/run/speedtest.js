import { interval } from 'rxjs'
import { map } from 'rxjs/operators'

import { createStore } from '../eventStore'

console.log('start')

createStore(
  ({
    eventSource,
    addLogger,
    pipeAggr
  }) => {
    pipeAggr((state = 1, { type, payload }) => {
      if (type !== 'event') {
        return state
      }
      return state + payload * state
    })
      .subscribe(count => console.log(count))

    interval(0)
      .pipe(map(payload => ({ type: 'event', payload })))
      .subscribe(eventSource)

    // addLogger(({ payload }) => console.log(payload))
  }
)
