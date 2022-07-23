import { omit } from './omit'

export const hasOnlyKeys = (obj, allowed) =>
  Object.keys(omit(obj, allowed)).length === 0
