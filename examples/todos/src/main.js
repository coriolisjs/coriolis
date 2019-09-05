import { createEventSource, createStore } from 'coriolis'

import { createUi } from './effects/ui'

createStore(createEventSource(undefined, (loggedEvent) => console.log({ loggedEvent })))
  .addEffect(createUi())
  .init()
