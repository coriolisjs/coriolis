import Vue from 'vue'

import ViewSwitch from '../components/ViewSwitch'

export const createUi = () => {
  Vue.config.productionTip = false

  return (eventSource, pipeReducer) => {
    const vue = new Vue({
      provide: {
        dispatch: event => eventSource.next(event),
        event$: eventSource.asObservable(),
        pipeReducer
      },
      render: createElement => createElement(ViewSwitch)
    })
      .$mount('#app')

    return () => {
      vue.$destroy()
    }
  }
}
