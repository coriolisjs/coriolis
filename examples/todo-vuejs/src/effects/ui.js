import Vue from 'vue'

import TodoApp from '../components/views/TodoApp.vue'
import About from '../components/views/About.vue'

import ViewSwitch from '../components/ViewSwitch'

import { urlbar } from '../effects/urlbar'
import { todolist, todolistFilterName } from '../aggrs/todo'

const views = {
  TodoApp,
  About
}

const viewNames = Object.keys(views)

export const createUi = () => {
  Vue.config.productionTip = false

  return ({ eventSubject, withAggr, addEffect }) => {
    addEffect(urlbar(viewNames))
    withAggr(todolist).connect()
    withAggr(todolistFilterName).connect()

    const vue = new Vue({
      provide: {
        dispatch: event => eventSubject.next(event),
        getSource: withAggr
      },
      render: createElement => createElement(ViewSwitch, { props: { views } })
    })
      .$mount('#app')

    return () => {
      const node = vue.$el
      vue.$destroy()
      node.parentNode.removeChild(node)
    }
  }
}
