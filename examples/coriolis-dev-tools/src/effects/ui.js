import Entry from '../components/Entry.svelte'
import { views } from '../components/views'

import { nav } from './nav'

import { eventList } from '../aggrs/eventList'
import { eventTypeList } from '../aggrs/eventTypeList'
import { eventListFilter } from '../aggrs/eventListFilter'
import { currentStoreSnapshot } from '../aggrs/currentStoreSnapshot'
import { aggrsList } from '../aggrs/aggrsList'
import { viewList } from '../aggrs/viewList'
import { enabledViewComponent } from '../aggrs/enabledViewComponent'

import { viewAdded } from '../events'

export const createUI = () => ({ addEffect, addSource, withAggr, eventSource }) => {
  addSource(views.map(viewAdded))
  addEffect(nav)

  withAggr(enabledViewComponent).connect()
  withAggr(viewList).connect()
  withAggr(eventList).connect()
  withAggr(eventTypeList).connect()
  withAggr(eventListFilter).connect()
  withAggr(currentStoreSnapshot).connect()
  withAggr(aggrsList).connect()

  const app = new Entry({
    target: document.body,
    props: {
      dispatch: event => eventSource.next(event),
      getSource: withAggr
    }
  })

  return () => {
    app.$destroy()
  }
}
