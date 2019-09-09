import { createEventSource, createStore } from 'coriolis'

import { getLocalStorageJSON, appendLocalStorage } from './libs/browser/localStorage'

import { createUi } from './effects/ui'
import { urlbar } from './effects/urlbar'
import { todolist } from './reducers/todo'

const storageKey = 'storedEventsForTodoListApp'

createStore(createEventSource(getLocalStorageJSON(storageKey, []), appendLocalStorage(storageKey)))
  .addRootReducer(todolist)
  .addEffect(createUi())
  .addEffect(urlbar)
  .init()
