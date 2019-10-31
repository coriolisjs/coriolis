import { devtoolsOpened, devtoolsClosed } from '../events'

// TODO: events could be converted into one unique event for both open and close
export const isDevtoolsOpen = ({ useEvent }) => (
  useEvent(devtoolsOpened, devtoolsClosed),
  event => event.type === devtoolsOpened.toString()
)
