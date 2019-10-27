import { eventList } from './eventList'
import { eventListFilter } from './eventListFilter'
import * as events from '../events'

const devtoolsEventNames = Object.values(events)
  .map(eventBuilder => eventBuilder.toString())
  .reduce((acc, type) => ({
    ...acc,
    [type]: true
  }), {})

const subjectEventList = ({ useAggr }) => (
  useAggr(eventList),
  eventList => eventList.filter(event => !devtoolsEventNames[event.type])
)

export const filteredEventList = ({ useAggr }) => (
  useAggr(subjectEventList),
  useAggr(eventListFilter),
  (events, filter) => filter
    ? events.filter(event => event.type.includes(filter))
    : events
)
