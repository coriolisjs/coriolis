import { createEventBuilder } from '@coriolis/coriolis'

export const createMinimumEvent = createEventBuilder('sent a minimal event')

export const createSimpleEvent = createEventBuilder(
  'sent a simple event',
  ({ message }) => message,
  ({ sender }) => sender && { sender }
)

export const requiredDouble = createEventBuilder('user required to double count')

export const incremented = createEventBuilder('user incremented count')
export const decremented = createEventBuilder('user decremented count')
