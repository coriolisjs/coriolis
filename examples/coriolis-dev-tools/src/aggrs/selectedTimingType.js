import { devtoolsTimingTypeSelected } from '../events'

// TODO: this kind of aggr is common, a parametered aggr could do the job with event as param
export const selectedTimingType = ({ useEvent }) => (
  useEvent(devtoolsTimingTypeSelected),
  ({ payload }) => payload
)
