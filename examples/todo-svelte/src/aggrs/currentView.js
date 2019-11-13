import { lastPayloadOfType } from 'coriolis-parametered-aggr'

import { changed } from '../events/view'

export const currentView = lastPayloadOfType(changed)
