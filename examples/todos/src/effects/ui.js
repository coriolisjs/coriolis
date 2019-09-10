import Vue from 'vue'

import TodoApp from '../components/views/TodoApp.vue'
import About from '../components/views/About.vue'

import ViewSwitch from '../components/ViewSwitch'

import { todolist } from '../reducers/todo'

const views = {
  TodoApp,
  About
}

export const createUi = () => {
  // Vue.config.productionTip = false

  return ({ eventSource, pipeReducer, initReducer }) => {
    initReducer(todolist)

    const vue = new Vue({
      provide: {
        dispatch: event => eventSource.next(event),
        event$: eventSource.asObservable(),
        pipeReducer
      },
      render: createElement => createElement(ViewSwitch(views))
    })
      .$mount('#app')

    return () => {
      vue.$destroy()
    }
  }
}
