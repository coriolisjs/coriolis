import { getUniqKeyName } from './getUniqKeyName'

export const objectFrom = (arr) =>
  arr.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [getUniqKeyName(acc, key)]: value,
    }),
    {},
  )
