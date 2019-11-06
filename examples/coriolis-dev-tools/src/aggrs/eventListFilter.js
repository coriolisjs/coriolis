import { lastPayloadOfType } from 'coriolis'

import { eventListFilterChange } from '../events'

export const eventListFilter = lastPayloadOfType(eventListFilterChange)
