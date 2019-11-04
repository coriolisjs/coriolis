import { createStore } from 'coriolis'

import { createUi } from './effects/ui'
import { localStorage } from './effects/localStorage'
import { logEvents } from './effects/logEvents'
import { wrapCoriolisOptions } from 'coriolis-dev-tools'

const storageKey = 'storedEventsForTodoListApp'

createStore(
  wrapCoriolisOptions(
    logEvents,
    localStorage(storageKey),
    createUi()
  )
)
