import { fromReducer } from '@coriolis/coriolis'
import { connect } from '../libs/vuejs/connect'

import { currentView } from '../projections/currentView'

const ViewSwitch = {
  name: 'ViewSwitch',
  data: () => ({
    viewName: undefined
  }),
  props: {
    views: {
      type: Object,
      required: true
    }
  },
  render (createElement) {
    if (!this.viewName) {
      return
    }
    return createElement(this.views[this.viewName])
  }
}

export default connect({
  mapProjection: {
    viewName: fromReducer(currentView)
  }
})(ViewSwitch)
