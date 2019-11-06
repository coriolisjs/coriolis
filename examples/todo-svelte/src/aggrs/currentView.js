import { lastPayloadOfType } from 'coriolis'

import { changed } from '../events/view'

export const currentView = lastPayloadOfType(changed)
