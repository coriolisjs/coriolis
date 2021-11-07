import { Observable } from 'rxjs'

import { simpleUnsub } from '../simpleUnsub'
import { useState } from '../../var/useState'

export const countSubscriptions = (callback) => (source) => {
  const { getState, setState } = useState(0)

  const up = () => callback(setState(getState() + 1))
  const down = () => callback(setState(getState() - 1))

  return new Observable((observer) => {
    up()
    const unsub = simpleUnsub(source.subscribe(observer))

    return () => {
      down()
      unsub()
    }
  })
}
