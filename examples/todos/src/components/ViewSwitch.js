import { currentView as currentViewAggr } from '../aggrs/currentView'

export default views => ({
  name: 'viewSwitch',
  inject: [
    'pipeAggr'
  ],
  created () {
    this.aggrSubscription = this.pipeAggr(currentViewAggr)
      .subscribe(newView => {
        this.currentView = newView
      })
  },
  beforeDestroy () {
    this.aggrSubscription.unsubscribe()
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
