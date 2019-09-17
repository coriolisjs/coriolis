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
