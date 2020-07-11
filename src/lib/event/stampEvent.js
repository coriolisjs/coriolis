import { getTimestamp } from '../time/timestamp'

/*
Adding a time reference for each event helps keeping an accurate view on events flow
*/
export const stampEvent = (event) =>
  event && event.meta && event.meta.timestamp
    ? event
    : {
        ...event,
        meta: {
          timestamp: getTimestamp(),
          ...event.meta,
        },
      }
