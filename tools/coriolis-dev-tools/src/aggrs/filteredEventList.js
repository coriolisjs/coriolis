import { compose } from '../lib/function/compose'

import { eventList } from './eventList'
import { eventListFilter } from './eventListFilter'

const includes = needle => haystack => haystack.includes(needle)
const loweredType = event => event.type.toLowerCase()

export const filteredEventList = ({ useAggr }) => (
  useAggr(eventList),
  useAggr(eventListFilter),
  (events, filter) =>
    filter
      ? events.filter(compose(loweredType, includes(filter.toLowerCase())))
      : events
)
