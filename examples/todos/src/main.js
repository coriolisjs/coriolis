import { createEventSource, createStore } from 'coriolis'

import { createUi } from './effects/ui'
import { createUrlbar } from './effects/urlbar'
import { todolist } from './reducers/todo'

const storageKey = 'storedEvents'

const getSource = (initial = []) => (JSON.parse(localStorage.getItem(storageKey)) || initial)

const logger = event => {
  localStorage.setItem(storageKey, JSON.stringify([...getSource(), event]))
}

createStore(createEventSource(getSource(), logger))
  .addRootReducer(todolist)
  .addEffect(createUi())
  .addEffect(createUrlbar())
  .init()
