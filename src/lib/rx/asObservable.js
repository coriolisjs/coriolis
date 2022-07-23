import { from, isObservable, of } from 'rxjs'

import { isPromise } from '../promise/isPromise'

export const asObservable = (obj) => {
  if (isPromise(obj) || Array.isArray(obj)) {
    return from(obj)
  }

  return !isObservable(obj) ? of(obj) : obj
}
