import { identity } from "./lib/function/identity.js";

const empty = {};

export const createEventBuilder = (
  type,
  payloadBuilder = identity,
  metaBuilder = null,
) => {
  const eventBuilder = (args = empty) => {
    const event = { type };
    let payload;
    let meta;

    try {
      payload = payloadBuilder(args);
    } catch (error) {
      payload = error;
      event.error = true;
    }

    if (metaBuilder) {
      try {
        meta = metaBuilder(args);
      } catch (error) {
        payload = error;
        event.error = true;
      }
    }

    if (payload !== empty) {
      event.payload = payload;
    }

    if (meta) {
      event.meta = meta;
    }

    if (payload instanceof Error) {
      event.error = true;
    }

    return event;
  };

  eventBuilder.toString = () => type;

  return eventBuilder;
};
