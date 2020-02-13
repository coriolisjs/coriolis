import { storeAdded } from '../events'

export const storeList = ({ useState, useEvent }) => (
  useState([]), useEvent(storeAdded), (list, event) => [...list, event.payload]
)
