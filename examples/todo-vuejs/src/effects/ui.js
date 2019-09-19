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

  return ({ eventSource, pipeAggr, initAggr, addEffect }) => {
    addEffect(urlbar(viewNames))
    initAggr(todolist)
    initAggr(todolistFilterName)

    const vue = new Vue({
      provide: {
        dispatch: event => eventSource.next(event),
        getSource: pipeAggr
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
