import { createStore } from '@coriolis/coriolis'

import { createUi } from './effects/ui'
import { localStorage } from './effects/localStorage'
import { wrapCoriolisOptions } from '@coriolis/dev-tools'

const storageKey = 'storedEventsForTodoListApp'

createStore(wrapCoriolisOptions(localStorage(storageKey), createUi()))
