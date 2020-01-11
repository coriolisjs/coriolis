import Entry from '../components/Entry.svelte'
import TodoApp from '../components/views/TodoApp.svelte'
import About from '../components/views/About.svelte'

import { urlbar } from '../effects/urlbar'
import { todolist, todolistFilterName } from '../projections/todo'

const views = {
  TodoApp,
  About
}

const viewNames = Object.keys(views)

export const createUi = () => ({ eventSubject, withProjection, addEffect }) => {
  addEffect(urlbar(viewNames))
  withProjection(todolist).connect()
  withProjection(todolistFilterName).connect()

  const app = new Entry({
    target: document.body,
    props: {
      dispatch: event => eventSubject.next(event),
      getSource: withProjection,
      views
    }
  })

  return () => {
    app.$destroy()
  }
}
