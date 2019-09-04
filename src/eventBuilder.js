import { identity } from 'rxjs'

export const createEventBuilder = (type, payloadBuilder = identity, metaBuilder) => {
  const empty = {}

  const eventBuilder = (args = empty) => {
    const event = { type }

    const payload = payloadBuilder(args)

    if (payload !== empty) {
      event.payload = payload
    }

    if (metaBuilder) {
      event.meta = metaBuilder(args)
    }

    if (payload instanceof Error) {
      event.error = true
    }

    return event
  }

  eventBuilder.toString = () => type

  return eventBuilder
}
