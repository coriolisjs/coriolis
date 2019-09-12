import { createStore } from 'coriolis'

import { createUi } from './effects/ui'
import { localStorage } from './effects/localStorage'
import { logEvents } from './effects/logEvents'

const storageKey = 'storedEventsForTodoListApp'

createStore(
  logEvents,
  localStorage(storageKey),
  createUi()
)
