import { devtoolsOpened, devtoolsClosed } from '../events'

export const isDevtoolsOpen = ({ useEvent }) => (
  useEvent(devtoolsOpened, devtoolsClosed),
  event => event.type === devtoolsOpened.toString()
)
