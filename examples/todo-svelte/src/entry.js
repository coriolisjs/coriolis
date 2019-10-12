import { createStore } from 'coriolis'

import { createUi } from './effects/ui'
import { localStorage } from './effects/localStorage'
// import { logEvents } from './effects/logEvents'
import { createCoriolisDevToolsEffect } from './devtools'

const storageKey = 'storedEventsForTodoListApp'

createStore(
  // logEvents,
  localStorage(storageKey),
  createUi(),
  createCoriolisDevToolsEffect()
)
