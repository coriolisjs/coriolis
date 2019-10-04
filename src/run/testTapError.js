import { from } from 'rxjs'

import { tap } from 'rxjs/operators'

from([1, 2, 3, 4])
  .pipe(
    tap(event => {
      if (event === 3) {
        throw new Error('test')
      }
    })
  )
  .subscribe(
    event => console.log('event', event),
    error => console.log('error', error),
    _ => console.log('complete')
  )
