import { tap } from 'rxjs/operators'

import { defered } from '../promise/defered'

export const promiseObservable = createObservable => {
  const { resolve, reject, promise: executionPromise } = defered()

  const execute = () =>
    createObservable().pipe(tap({ error: reject, complete: resolve }))

  return {
    execute,
    executionPromise,
  }
}
