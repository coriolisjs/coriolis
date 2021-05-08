import { identity } from 'rxjs'
import { map } from 'rxjs/operators'
import { produce } from 'immer'
import { createStore } from '@coriolis/coriolis'
import { wrapCoriolisOptions } from '@coriolis/dev-tools'

import { createUIEffect } from './effects/ui'
import { createLocalStorageEffect } from './todo-core/effects/localStorage'

const storageKey = 'storedEventsForTodoListApp'

createStore(
  wrapCoriolisOptions(
    {
      storeName: 'todo-svelte',
      eventEnhancer: map(produce(identity)),
    },
    createLocalStorageEffect(storageKey),
    createUIEffect(),
  ),
)
