import { createStore } from 'coriolis'

import { createUi } from './effects/ui'
import { urlbar } from './effects/urlbar'
import { localStorage } from './effects/localStorage'

const storageKey = 'storedEventsForTodoListApp'

createStore(
  localStorage(storageKey),
  createUi(),
  urlbar
)
