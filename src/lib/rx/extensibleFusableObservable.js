import {
  from
} from 'rxjs'

import { createExtensibleObservable } from './extensibleObservable'
import { createFuse } from '../function/createFuse'

export const createExtensibleFusableObservable = cutMessage => {
  const {
    observable,
    add
  } = createExtensibleObservable()

  const {
    pass: addSource,
    cut: disableAddSource
  } = createFuse(
    source => add(from(source)),
    () => { throw new Error(cutMessage) }
  )

  return {
    observable,
    addSource,
    disableAddSource
  }
}
