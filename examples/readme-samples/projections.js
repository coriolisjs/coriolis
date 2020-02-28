import { incremented, decremented } from './events'

export const currentCount = ({ useState, useEvent }) => (
  // Initial value for state should be defined here
  useState(0),
  // Here we filter events we will get
  useEvent(incremented, decremented),
  (count, { type }) => (type === incremented.toString() ? count + 1 : count - 1)
)

export const eventsNumber = ({ useState, useEvent }) => (
  // Let's start counting from 0
  useState(0),
  // needs each event just to trigger the projection
  useEvent(),
  state => state + 1
)

export const lastEventType = ({ useEvent }) => (
  // For this projection, no need for a state, just events
  useEvent(), event => event.type
)

export const moreComplexProjection = ({ useProjection }) => (
  useProjection(currentCount),
  useProjection(eventsNumber),
  useProjection(lastEventType),
  (currentCountValue, eventsNumber, lastType) => ({
    currentCountValue,
    eventsNumber,
    lastType,
  })
)
