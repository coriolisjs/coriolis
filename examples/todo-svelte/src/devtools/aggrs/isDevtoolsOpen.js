import { devtoolsOpened, devtoolsClosed } from '../events'

export const isDevtoolsOpen = (isOpen = false, event) => {
  switch (event.type) {
    case devtoolsOpened.toString():
      return true

    case devtoolsClosed.toString():
      return false

    default:
        return isOpen
  }
}
