import { identity } from 'rxjs'
import { map } from 'rxjs/operators'
import { produce } from 'immer'
import { createStore } from 'coriolis'

import { createUi } from './effects/ui'
import { localStorage } from './effects/localStorage'
// import { logEvents } from './effects/logEvents'
import { wrapCoriolisOptions } from './devtools'

const storageKey = 'storedEventsForTodoListApp'

createStore(wrapCoriolisOptions(
  {
    storeName: 'todo-svelte',
    eventEnhancer: map(produce(identity))
  },
  // logEvents,
  localStorage(storageKey),
  createUi()
))
