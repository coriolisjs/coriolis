import { lastPayloadOfType } from 'coriolis'

import { devtoolsTimingTypeSelected } from '../events'

export const selectedTimingType = lastPayloadOfType(devtoolsTimingTypeSelected)
