import { map, startWith } from 'rxjs/operators'

import Entry from '../components/Entry.svelte'
import { views } from '../components/views'

import { eventList } from '../aggrs/eventList'
import { eventTypeList } from '../aggrs/eventTypeList'

export const createUI = () => ({ connectAggr, pipeAggr, eventSource, getSnapshot }) => {
  connectAggr(eventList)
  connectAggr(eventTypeList)

  const snapshot$ = eventSource
    .pipe(
      startWith(true),
      map(() => getSnapshot())
    )

  const app = new Entry({
    target: document.body,
    props: {
      dispatch: event => eventSource.next(event),
      getSource: pipeAggr,
      snapshot$,
      views
    }
  })

  return () => {
    app.$destroy()
  }
}
