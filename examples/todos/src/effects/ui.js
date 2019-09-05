import Vue from 'vue'

import createApp from '../components/App'

const todoItems = (state = [], event) => {
  if (event.type !== 'add todo item') {
    return state
  }

  return [...state, event.payload]
}

export const createUi = () => {
  Vue.config.productionTip = false

  return (eventSource, pipeReducer) => {
    // const dispatch = event => eventSource.next(event)

    const vue = new Vue(createApp(eventSource, pipeReducer))
      .$mount('#app')

    // vue.$on('dispatch', dispatch)

    return () => {
      // vue.$off('dispatch', dispatch)
      vue.$destroy()
    }

    // return pipeReducer(todoItems).subscribe(data => {
    //   vue.$set(vue, 'appdata', data)
    // })
    //   .add(() => {
    //     vue.$off('dispatch', dispatch)
    //     vue.$destroy()
    //   })
  }
}
