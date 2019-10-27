import { EMPTY } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { createUI } from './effects/ui'
import { createNav } from './effects/nav'

import { viewNames } from './components/views'

export const createCoriolisDevToolsEffect = (aggregatorEvents = EMPTY) => ({ addEffect, eventSource, initialEvent$ }) => {
  const removeUI = addEffect(createUI())
  const removeNav = addEffect(createNav(viewNames))

  const aggregatorEventList = []
  let aggregatorEventsState = {}
  // const subscription1 = aggregatorEvents
  //   .subscribe(event => aggregatorEventList.push(event))

  const subscription4 = initialEvent$.subscribe(() => {
    aggregatorEventsState = {
      ...aggregatorEventsState,
      eventsCount: (aggregatorEventsState.eventsCount || 0) + 1
    }
  })

  const subscription3 = eventSource.subscribe(() => {
    aggregatorEventsState = {
      ...aggregatorEventsState,
      eventsCount: (aggregatorEventsState.eventsCount || 0) + 1
    }
  })

  const subscription1 = aggregatorEvents
    .subscribe(event => {
      const aggrName = (event.payload && event.payload.name) || 'unnamed'
      const byType = aggregatorEventsState[event.type] || {}
      const byTypeAndAggr = byType[aggrName]

      aggregatorEventsState = {
        ...aggregatorEventsState,
        [event.type]: {
          ...byType,
          [aggrName]: (byTypeAndAggr || 0) + 1,
          __count: (byType.__count || 0) + 1
        },
        __count: (aggregatorEventsState.__count || 0) + 1
      }
    })

  const subscription2 = aggregatorEvents
    .pipe(
      debounceTime(1000)
    )
    .subscribe(() => {
      // console.log(aggregatorEventList.length)
      // console.log(aggregatorEventList.reduce((acc, event) => ({
      //   ...acc,
      //   [event.type]: (acc[event.type] || 0) + 1
      // }), {}))

      // console.log(aggregatorEventList
      //   // .filter(event => event.type === 'Coriolis devtools detected an aggr have been called')
      //   .reduce((acc, event) => ({
      //     ...acc,
      //     [event.type]: {
      //       ...acc[event.type],
      //       [event.payload && event.payload.name]: (acc[event.type] && acc[event.type][event.payload && event.payload.name] || 0) + 1,
      //       __count: ((acc[event.type] && acc[event.type].__count) || 0) + 1
      //     }
      //   }), {}))
      console.log(aggregatorEventsState)
    })
    // .subscribe(event => console.log(event))
    // .subscribe(eventSource)

  return () => {
    removeUI()
    removeNav()
    subscription1.unsubscribe()
    subscription2.unsubscribe()
    subscription3.unsubscribe()
    subscription4.unsubscribe()
  }
}
