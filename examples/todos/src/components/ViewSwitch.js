import { firstKey } from '../libs/object/firstKey'

import { changed } from '../events/view'
import { currentView as currentViewReducer } from '../reducers/currentView'

export default views => ({
  name: 'viewSwitch',
  inject: [
    'dispatch',
    'pipeReducer'
  ],
  created () {
    this.reducerSubscription = this.pipeReducer(currentViewReducer).subscribe(newView => {
      if (!views[newView]) {
        const view = this.currentView || firstKey(views)
        this.dispatch(changed({ view }))
        return
      }
      this.currentView = newView
    })
  },
  beforeDestroy () {
    this.reducerSubscription.unsubscribe()
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
})
