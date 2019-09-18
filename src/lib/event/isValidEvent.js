import { hasOnlyKeys } from '../object/hasOnlyKeys'

export const isValidEvent = event =>
  event &&
  event.type &&
  hasOnlyKeys(event, ['type', 'payload', 'error', 'meta']) &&
  (event.error === undefined || typeof event.error === 'boolean') &&
  (event.meta === undefined || typeof event.meta === 'object')
