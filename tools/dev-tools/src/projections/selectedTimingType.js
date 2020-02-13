import { lastPayloadOfType } from '@coriolis/parametered-projection'

import { timingTypeSelected } from '../events'

export const selectedTimingType = lastPayloadOfType(timingTypeSelected)
