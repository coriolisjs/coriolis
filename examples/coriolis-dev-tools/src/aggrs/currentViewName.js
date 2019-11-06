import { lastPayloadOfType } from 'coriolis'

import { viewChanged } from '../events'

export const currentViewName = lastPayloadOfType(viewChanged)
