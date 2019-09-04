import { Observable } from 'rxjs'

export const startWithGetter = getter => source => Observable.create(observer => {
  const last = getter()
  if (last) {
    observer.next(last.value)
  }

  return source.subscribe(observer)
})
