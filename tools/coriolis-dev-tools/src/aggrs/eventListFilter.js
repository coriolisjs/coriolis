import { lastPayloadOfType } from 'coriolis-parametered-aggr'

import { eventListFilterChange } from '../events'

export const eventListFilter = lastPayloadOfType(eventListFilterChange)
