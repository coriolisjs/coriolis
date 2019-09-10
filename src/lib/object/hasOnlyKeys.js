import { withoutKeys } from './withoutKeys'

export const hasOnlyKeys = (obj, allowed) =>
  Object.keys(withoutKeys(obj, allowed)).length === 0
