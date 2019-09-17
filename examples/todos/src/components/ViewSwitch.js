import { currentView as currentViewAggr } from '../aggrs/currentView'

export default {
  name: 'ViewSwitch',
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
  data: () => ({
    currentView: undefined
  }),
  props: {
    views: {
      type: Object,
      required: true
    }
  },
  render (createElement) {
    if (!this.currentView) {
      return
    }
    return createElement(this.views[this.currentView])
  }
}
