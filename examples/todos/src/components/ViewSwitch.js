import TodoApp from './views/TodoApp.vue'
import About from './views/About.vue'

import { changed } from '../events/view'
import { currentView as currentViewReducer } from '../reducers/currentView'

const views = {
  TodoApp,
  About
}

const firstKey = obj => Object.keys(obj)[0]

export default {
  name: 'viewSwitch',
  inject: [
    'dispatch',
    'pipeReducer'
  ],
  created () {
    this.pipeReducer(currentViewReducer).subscribe(newView => {
      if (!views[newView]) {
        const view = this.currentView || firstKey(views)
        this.dispatch(changed({ view }))
        return
      }
      this.currentView = newView
    })
  },
  data () {
    return {
      currentView: undefined
    }
  },
  render (createElement) {
    if (!this.currentView) {
      return
    }
    return createElement(views[this.currentView])
  }
}
