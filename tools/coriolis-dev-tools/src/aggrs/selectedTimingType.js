import { lastPayloadOfType } from 'coriolis'

import { timingTypeSelected } from '../events'

export const selectedTimingType = lastPayloadOfType(timingTypeSelected)
