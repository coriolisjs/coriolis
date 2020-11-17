import Vue from 'vue'

import TodoApp from '../components/views/TodoApp.vue'
import About from '../components/views/About.vue'

import ViewSwitch from '../components/ViewSwitch'

import { urlbar } from '../todo-core/effects/urlbar'
import { todolist, todolistFilterName } from '../todo-core/projections/todo'

const views = {
  TodoApp,
  About,
}

const viewNames = Object.keys(views)

export const createUi = () => {
  Vue.config.productionTip = false

  return ({ dispatch, withProjection, addEffect }) => {
    addEffect(urlbar(viewNames))
    withProjection(todolist).connect()
    withProjection(todolistFilterName).connect()

    const vue = new Vue({
      provide: {
        dispatch,
        withProjection,
      },
      render: (createElement) =>
        createElement(ViewSwitch, { props: { views } }),
    }).$mount('#app')

    return () => {
      const node = vue.$el
      vue.$destroy()
      node.parentNode.removeChild(node)
    }
  }
}
