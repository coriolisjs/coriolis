import { isPromise } from '../promise/isPromise'
import { from, isObservable, of } from 'rxjs'

export const asObservable = obj => {
  if (isPromise(obj) || Array.isArray(obj)) {
    return from(obj)
  }

  return !isObservable(obj) ? of(obj) : obj
}
