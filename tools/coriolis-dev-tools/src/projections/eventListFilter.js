import { lastPayloadOfType } from 'coriolis-parametered-projection'

import { eventListFilterChange } from '../events'

export const eventListFilter = lastPayloadOfType(eventListFilterChange)
