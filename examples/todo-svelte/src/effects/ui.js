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

export const createUi = () => ({ eventSource, pipeAggr, initAggr, addEffect }) => {
  addEffect(urlbar(viewNames))
  initAggr(todolist)
  initAggr(todolistFilterName)

  const app = new Entry({
    target: document.body,
    props: {
      dispatch: event => eventSource.next(event),
      getSource: pipeAggr,
      views
    }
  })

  return () => {
    app.$destroy()
  }
}
