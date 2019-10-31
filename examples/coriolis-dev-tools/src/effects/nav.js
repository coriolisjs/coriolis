import { Observable } from 'rxjs'

import { currentView } from '../aggrs/currentView'
import { viewChanged } from '../events'
import { isAvailableView } from '../aggrs/isAvailableView'

const UNDEFINED_VIEW_NAME = 'UndefinedView'

export const createNav = viewNames => ({ addSource, withAggr, eventSource }) => {
  const currentView$ = withAggr(currentView)
  const removeSource = addSource(Observable.create(observer => {
    if (!currentView$.value) {
      observer.next(viewChanged(viewNames[0] || UNDEFINED_VIEW_NAME))
    }
    observer.complete()
  }))

  const availableViewSubscription = withAggr(isAvailableView(viewNames))
    .subscribe(isAvailable => !isAvailable && eventSource.next(viewChanged(viewNames[0])))

  return () => {
    removeSource()
    availableViewSubscription.unsubscribe()
  }
}
