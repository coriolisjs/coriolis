import { devtoolsTimingTypeSelected } from '../events'

export const selectedTimingType = (selected, event) => {
  if (event.type !== devtoolsTimingTypeSelected.toString()) {
    return selected
  }

  return event.payload
}
