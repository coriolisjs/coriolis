import { currentView as currentViewReducer } from '../reducers/currentView'

export default views => ({
  name: 'viewSwitch',
  inject: [
    'pipeReducer'
  ],
  created () {
    this.reducerSubscription = this.pipeReducer(currentViewReducer)
      .subscribe(newView => {
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
