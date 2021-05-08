import { identity } from 'rxjs'
import { map } from 'rxjs/operators'
import { produce } from 'immer'
import { createStore } from '@coriolis/coriolis'

import { createUIEffect } from './effects/ui'
import { createLocalStorageEffect } from './todo-core/effects/localStorage'
import { wrapCoriolisOptions } from '@coriolis/dev-tools'

const storageKey = 'storedEventsForTodoListApp'

createStore(
  wrapCoriolisOptions(
    {
      eventEnhancer: map(produce(identity)),
    },
    createLocalStorageEffect(storageKey),
    createUIEffect(),
  ),
)
