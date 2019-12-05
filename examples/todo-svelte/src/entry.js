import { identity } from 'rxjs'
import { map } from 'rxjs/operators'
import { produce } from 'immer'
import { createStore } from 'coriolis'
import { wrapCoriolisOptions } from 'coriolis-dev-tools'

import { createUi } from './effects/ui'
import { localStorage } from './effects/localStorage'

const storageKey = 'storedEventsForTodoListApp'

createStore(
  wrapCoriolisOptions(
    {
      storeName: 'todo-svelte',
      eventEnhancer: map(produce(identity)),
    },
    localStorage(storageKey),
    createUi(),
  ),
)
