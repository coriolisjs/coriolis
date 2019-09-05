import Vue from 'vue'

import TodoApp from '../components/views/TodoApp'

export const createUi = () => {
  Vue.config.productionTip = false

  return (eventSource, pipeReducer) => {
    const vue = new Vue({
      provide: {
        dispatch: event => eventSource.next(event),
        event$: eventSource.asObservable(),
        pipeReducer
      },
      render: h => h(TodoApp)
    })
      .$mount('#app')

    return () => {
      vue.$destroy()
    }
  }
}
