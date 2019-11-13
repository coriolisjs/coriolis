import { lastPayloadOfType } from 'coriolis-parametered-aggr'

import { timingTypeSelected } from '../events'

export const selectedTimingType = lastPayloadOfType(timingTypeSelected)
