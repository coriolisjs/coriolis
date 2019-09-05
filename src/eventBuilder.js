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
    }

    if (metaBuilder) {
      try {
        event.meta = metaBuilder(args)
      } catch (error) {
        payload = error
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

  eventBuilder.toString = () => type

  return eventBuilder
}
