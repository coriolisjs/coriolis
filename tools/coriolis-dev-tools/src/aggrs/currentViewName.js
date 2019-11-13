import { lastPayloadOfType } from 'coriolis-parametered-aggr'

import { viewChanged } from '../events'

export const currentViewName = lastPayloadOfType(viewChanged)
