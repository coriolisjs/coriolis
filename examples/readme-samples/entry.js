import { createStore } from '@coriolis/coriolis'

import { createMinimumEvent, createSimpleEvent } from './events'
import { myDisplayEffect, myUserEffect } from './effects'


export const exposeSimpleEvents = () => {
  const minimum = createMinimumEvent()

  const simple = createSimpleEvent({ message: 'simple' })

  const simpleError = createSimpleEvent({ message: new Error('Could not be that simple') })

  const withMeta = createSimpleEvent({
    message: 'answer me if you got it',
    sender: 'Nico'
  })

  console.log(minimum)
  console.log(simple)
  console.log(simpleError)
  console.log(withMeta)

  console.log(createMinimumEvent.toString())
  // 'sent a minimal event'

  console.log(createSimpleEvent.toString())
  // 'sent a simple event'
}


export const exposeDoublingEffect = () =>
  createStore(myDisplayEffect, myUserEffect)
