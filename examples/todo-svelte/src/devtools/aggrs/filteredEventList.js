import { eventList } from './eventList'
import { eventListFilter } from './eventListFilter'

export const filteredEventList = ({ useAggr }) => (
  useAggr(eventList),
  useAggr(eventListFilter),
  (events, filter) => filter
    ? events.filter(event => event.type.includes(filter))
    : events
)
