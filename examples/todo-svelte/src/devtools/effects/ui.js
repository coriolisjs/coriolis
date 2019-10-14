import Entry from '../components/Entry.svelte'
import { views } from '../components/views'

import { eventList } from '../aggrs/eventList'
import { eventTypeList } from '../aggrs/eventTypeList'
import { eventListFilter } from '../aggrs/eventListFilter'

export const createUI = () => ({ withAggr, eventSource }) => {
  withAggr(eventList).connect()
  withAggr(eventTypeList).connect()
  withAggr(eventListFilter).connect()

  const app = new Entry({
    target: document.body,
    props: {
      dispatch: event => eventSource.next(event),
      getSource: withAggr,
      views
    }
  })

  return () => {
    app.$destroy()
  }
}
