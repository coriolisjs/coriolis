import Entry from '../components/Entry.svelte'
import EventsList from '../components/views/EventsList.svelte'

import { eventList } from '../aggrs/eventList'

export const createUI = () => ({ connectAggr, pipeAggr, eventSource }) => {
  connectAggr(eventList)

  const getSource = (aggr, callback) => callback
    ? pipeAggr(aggr).subscribe(callback)
    : pipeAggr(aggr)

  const getValue = aggr => {
    let value

    pipeAggr(aggr)
      .subscribe(data => { value = data })
      .unsubscribe()

    return value
  }

  const app = new Entry({
    target: document.body,
    props: {
      dispatch: event => eventSource.next(event),
      getSource,
      getValue,
      views: {
        EventsList
      }
    }
  })

  return () => {
    app.$destroy()
  }
}
