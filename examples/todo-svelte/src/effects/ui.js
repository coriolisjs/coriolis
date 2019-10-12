import Entry from '../components/Entry.svelte'
import TodoApp from '../components/views/TodoApp.svelte'
import About from '../components/views/About.svelte'

import { urlbar } from '../effects/urlbar'
import { todolist, todolistFilterName } from '../aggrs/todo'

const views = {
  TodoApp,
  About
}

const viewNames = Object.keys(views)

export const createUi = () => ({ eventSource, withAggr, addEffect }) => {
  addEffect(urlbar(viewNames))
  withAggr(todolist).connect()
  withAggr(todolistFilterName).connect()

  const app = new Entry({
    target: document.body,
    props: {
      dispatch: event => eventSource.next(event),
      getSource: withAggr,
      views
    }
  })

  return () => {
    app.$destroy()
  }
}
