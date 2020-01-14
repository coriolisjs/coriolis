import { lastPayloadOfType } from '@coriolis/parametered-projection'

import { changed } from '../events/view'

export const currentView = lastPayloadOfType(changed)
