import { Observable } from 'rxjs'

import { defaultViewName } from '../aggrs/defaultViewName'
import { currentViewName } from '../aggrs/currentViewName'
import { replacementViewName } from '../aggrs/replacementViewName'

import { viewChanged } from '../events'

const UNDEFINED_VIEW_NAME = 'UndefinedView'

export const nav = ({ addSource, withAggr, eventSource }) => {
  const currentViewName$ = withAggr(currentViewName)
  const defaultViewName$ = withAggr(defaultViewName)

  const removeSource = addSource(Observable.create(observer => {
    if (!currentViewName$.value) {
      observer.next(viewChanged(defaultViewName$.value || UNDEFINED_VIEW_NAME))
    }
    observer.complete()
  }))

  const replaceViewSubscription = withAggr(replacementViewName)
    .subscribe(viewName => viewName && eventSource.next(viewChanged(viewName)))

  return () => {
    removeSource()
    replaceViewSubscription.unsubscribe()
  }
}
