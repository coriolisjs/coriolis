import { Observable } from 'rxjs'

import { currentView } from '../aggrs/currentView'
import { viewChanged } from '../events'
import { isDevtoolsOpen } from '../aggrs/isDevtoolsOpen'

const UNDEFINED_VIEW_NAME = 'UndefinedView'

const isAvailableView = viewNames => ({ useAggr }) => (
  useAggr(isDevtoolsOpen),
  useAggr(currentView),
  (isOpen, viewName) => viewNames.includes(viewName) || !isOpen
)

export const createNav = viewNames => ({ addSource, withAggr, eventSource }) => {
  const removeSource = addSource(Observable.create(observer => {
    if (!withAggr(currentView).value) {
      observer.next(viewChanged(viewNames[0] || UNDEFINED_VIEW_NAME))
    }
    observer.complete()
  }))

  const availableViewSubscription = withAggr(isAvailableView(viewNames)).subscribe(isAvailable =>
    !isAvailable && eventSource.next(viewChanged(viewNames[0])))

  return () => {
    removeSource()
    availableViewSubscription.unsubscribe()
  }
}
