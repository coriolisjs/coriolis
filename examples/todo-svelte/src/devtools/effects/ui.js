import { map, startWith } from 'rxjs/operators'

import Entry from '../components/Entry.svelte'
import { views } from '../components/views'

import { eventList } from '../aggrs/eventList'
import { eventTypeList } from '../aggrs/eventTypeList'
import { eventListFilter } from '../aggrs/eventListFilter'

export const createUI = () => ({ withAggr, eventSource, getSnapshot }) => {
  withAggr(eventList).connect()
  withAggr(eventTypeList).connect()
  withAggr(eventListFilter).connect()

  const snapshot$ = eventSource
    .pipe(
      startWith(true),
      map(() => getSnapshot())
    )

  const app = new Entry({
    target: document.body,
    props: {
      dispatch: event => eventSource.next(event),
      getSource: withAggr,
      snapshot$,
      views
    }
  })

  return () => {
    app.$destroy()
  }
}
