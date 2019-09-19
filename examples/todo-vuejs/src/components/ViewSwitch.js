import { connect } from '../libs/vuejs/connect'

import { currentView as currentViewAggr } from '../aggrs/currentView'

const ViewSwitch = {
  name: 'ViewSwitch',
  data: () => ({
    currentView: undefined
  }),
  props: {
    views: {
      type: Object,
      required: true
    }
  },
  watch: {
    views (...args) {
      console.log('views changed', this.views, args)
    }
  },
  created () {
    console.log('initial views', this.views)
  },
  render (createElement) {
    if (!this.currentView) {
      return
    }
    return createElement(this.views[this.currentView])
  }
}

export default connect({
  mapSource: {
    currentView: currentViewAggr
  }
})(ViewSwitch)
