import { createIndex } from '../lib/map/objectIndex'

export const fromReducer = createIndex(
  (reducer) =>
    ({ useState, useEvent }) => (useState(), useEvent(), reducer),
).get
