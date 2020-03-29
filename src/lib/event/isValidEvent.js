import { hasOnlyKeys } from '../object/hasOnlyKeys'

export const isCommand = (command) => typeof command === 'function'

const isEvent = (event) =>
  event.type &&
  hasOnlyKeys(event, ['type', 'payload', 'error', 'meta']) &&
  (event.error === undefined || typeof event.error === 'boolean') &&
  (event.meta === undefined || typeof event.meta === 'object')

export const isValidEvent = (event) =>
  event && (isCommand(event) || isEvent(event))
