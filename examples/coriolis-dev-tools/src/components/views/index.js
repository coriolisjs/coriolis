import AggrList from './AggrList.svelte'
import EventList from './EventList.svelte'
import EventTypeList from './EventTypeList.svelte'
import Snapshot from './Snapshot.svelte'

export const views = [
  {
    name: 'EventList',
    longname: 'Liste des events',
    component: EventList,
  },
  {
    name: 'Snapshot',
    longname: 'Snapshot',
    component: Snapshot,
  },
  {
    name: 'AggrList',
    longname: 'Liste des aggrégats',
    component: AggrList,
  },
  {
    name: 'EventTypeList',
    longname: 'Liste des types d\' event',
    component: EventTypeList,
  }
]

export const viewNames = views.map(view => view.name)
