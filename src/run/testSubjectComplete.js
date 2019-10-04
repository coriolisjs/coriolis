import { Subject, interval } from 'rxjs'

import { take, tap } from 'rxjs/operators'

const mergingSubject = new Subject()

mergingSubject
  .subscribe(
    event => console.log('event', event),
    error => console.log('error', error),
    _ => console.log('complete')
  )

interval(400)
  .pipe(
    take(3),
    tap(
      event => console.log('interval1 event', event),
      error => console.log('interval1 error', error),
      _ => console.log('interval1 complete')
    )
  )
  .subscribe(mergingSubject)

interval(400)
  .pipe(
    take(5),
    tap(
      event => console.log('interval2 event', event),
      error => console.log('interval2 error', error),
      _ => console.log('interval2 complete')
    )
  )
  .subscribe(mergingSubject)
