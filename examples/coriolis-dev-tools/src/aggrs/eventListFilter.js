import { lastPayloadOfType } from 'coriolis'

import { devtoolsEventListFilterChange } from '../events'

export const eventListFilter = lastPayloadOfType(devtoolsEventListFilterChange)
