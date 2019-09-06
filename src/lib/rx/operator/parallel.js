import { Observable, Subject, merge } from 'rxjs'

export const parallel = combine => (...operators) => source =>
  Observable.create(observer => {
    const broadcaster = new Subject()
    combine(
      ...operators.map(operator => broadcaster.pipe(operator))
    )
      .subscribe(observer)
      .add(source.subscribe(broadcaster))
  })

export const parallelMerge = parallel(merge)
