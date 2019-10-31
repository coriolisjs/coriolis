import Entry from '../components/Entry.svelte'
import { views } from '../components/views'

import { eventList } from '../aggrs/eventList'
import { eventTypeList } from '../aggrs/eventTypeList'
import { eventListFilter } from '../aggrs/eventListFilter'
import { currentStoreSnapshot } from '../aggrs/currentStoreSnapshot'
import { aggrsIndex } from '../aggrs/aggrsList'

export const createUI = () => ({ withAggr, eventSource }) => {
  withAggr(eventList).connect()
  withAggr(eventTypeList).connect()
  withAggr(eventListFilter).connect()
  withAggr(currentStoreSnapshot).connect()
  withAggr(aggrsIndex).connect()

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
