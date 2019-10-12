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

export const createNav = viewNames => ({ addSource, aggrValue, pipeAggr, eventSource }) => {
  const removeSource = addSource(Observable.create(observer => {
    if (!aggrValue(currentView)) {
      observer.next(viewChanged(viewNames[0] || UNDEFINED_VIEW_NAME))
    }
    observer.complete()
  }))

  const availableViewSubscription = pipeAggr(isAvailableView(viewNames)).subscribe(isAvailable =>
    !isAvailable && eventSource.next(viewChanged(viewNames[0])))

  return () => {
    removeSource()
    availableViewSubscription.unsubscribe()
  }
}
