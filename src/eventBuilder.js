import { identity } from 'rxjs'

export const createEventBuilder = (type, payloadBuilder = identity, metaBuilder) => {
  const empty = {}

  const eventBuilder = (args = empty) => {
    const event = { type }
    let payload

    try {
      payload = payloadBuilder(args)
    } catch (error) {
      payload = error
      event.error = true
    }

    if (metaBuilder) {
      try {
        event.meta = metaBuilder(args)
      } catch (error) {
        payload = error
        event.error = true
      }
    }

    if (payload !== empty) {
      event.payload = payload
    }

    if (payload instanceof Error) {
      event.error = true
    }

    return event
  }

  // TODO: could use a parametered aggr here
  const aggr = (lastEvent, event) =>
    event.type === type
      ? event
      : lastEvent

  Object.defineProperty(aggr, 'name', {
    value: `last event of type: ${type.toString()}`,
    writable: false
  })

  eventBuilder.toString = () => type
  eventBuilder.toAggr = () => aggr

  return eventBuilder
}
