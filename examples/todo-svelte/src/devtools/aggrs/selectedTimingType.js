import { timingTypeSelected } from '../events'

export const selectedTimingType = (selected, event) => {
  if (event.type !== timingTypeSelected.toString()) {
    return selected
  }

  return event.payload
}
