import { uniqSymbol } from '../symbol/uniqSymbol'

/*
Adding a uniq property in every event's metadata, we can ensure each events enters only once
*/
export const preventEventLoops = (secretKey = uniqSymbol()) => (event) => {
  if (event.meta && event.meta[secretKey]) {
    throw new Error('Event coming back to source detected')
  }

  return {
    ...event,
    meta: Object.defineProperty({ ...event.meta }, secretKey, {
      configurable: false,
      enumerable: true,
      writable: false,
      value: true,
    }),
  }
}
