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

export const createUi = () => ({ eventSource, pipeAggr, connectAggr, addEffect }) => {
  addEffect(urlbar(viewNames))
  connectAggr(todolist)
  connectAggr(todolistFilterName)

  const getSource = (aggr, callback) => callback
    ? pipeAggr(aggr).subscribe(callback)
    : pipeAggr(aggr)

  const getValue = aggr => {
    let value

    pipeAggr(aggr)
      .subscribe(data => { value = data })
      .unsubscribe()

    return value
  }

  const app = new Entry({
    target: document.body,
    props: {
      dispatch: event => eventSource.next(event),
      getSource,
      getValue,
      views
    }
  })

  return () => {
    app.$destroy()
  }
}
