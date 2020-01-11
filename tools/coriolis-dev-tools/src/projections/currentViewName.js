import { lastPayloadOfType } from 'coriolis-parametered-projection'

import { viewChanged } from '../events'

export const currentViewName = lastPayloadOfType(viewChanged)
