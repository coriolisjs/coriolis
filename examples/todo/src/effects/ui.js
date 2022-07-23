import Entry from '../components/Entry.svelte'

import TodoApp from '../components/views/TodoApp.svelte'
import About from '../components/views/About.svelte'
import Router from '../components/Router.svelte'

import { createUrlbarEffect } from '../todo-core/effects/urlbar'
import { todolist, todolistFilterName } from '../todo-core/projections/todo'

const views = {
  TodoApp,
  About,
}

const viewNames = Object.keys(views)

export const createUIEffect = () => {
  return function userInterface({ dispatch, withProjection, addEffect }) {
    addEffect(createUrlbarEffect(viewNames))
    withProjection(todolist).connect()
    withProjection(todolistFilterName).connect()

    const app = new Entry({
      target: document.body,
      props: {
        withProjection,
        dispatch,
        Root: Router,
        views,
      },
    })

    return () => {
      app.$destroy()
    }
  }
}
