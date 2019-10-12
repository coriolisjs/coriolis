import AggrList from './AggrList.svelte'
import EventList from './EventList.svelte'
import EventTypeList from './EventTypeList.svelte'
import Snapshot from './Snapshot.svelte'

export const views = [
  {
    name: 'AggrList',
    longname: 'Liste des aggrégats',
    component: AggrList,
  },
  {
    name: 'EventList',
    longname: 'Liste des events',
    component: EventList,
  },
  {
    name: 'EventTypeList',
    longname: 'Liste des types d\' event',
    component: EventTypeList,
  },
  {
    name: 'Snapshot',
    longname: 'Snapshot',
    component: Snapshot,
  }
]

export const viewNames = views.map(view => view.name)
