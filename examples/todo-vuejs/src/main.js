import { identity } from 'rxjs'
import { map } from 'rxjs/operators'
import { produce } from 'immer'
import { createStore } from '@coriolis/coriolis'

import { createUi } from './effects/ui'
import { localStorage } from './todo-core/effects/localStorage'
import { wrapCoriolisOptions } from '@coriolis/dev-tools'

const storageKey = 'storedEventsForTodoListApp'

createStore(
  wrapCoriolisOptions(
    {
      eventEnhancer: map(produce(identity)),
    },
    localStorage(storageKey),
    createUi(),
  ),
)
