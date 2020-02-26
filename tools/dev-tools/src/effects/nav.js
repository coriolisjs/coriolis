import { Observable } from 'rxjs'

import { defaultViewName } from '../projections/defaultViewName'
import { currentViewName } from '../projections/currentViewName'
import { replacementViewName } from '../projections/replacementViewName'

import { viewChanged } from '../events'

const UNDEFINED_VIEW_NAME = 'UndefinedView'

export const nav = ({ addSource, withProjection, dispatch }) => {
  const currentViewName$ = withProjection(currentViewName)
  const defaultViewName$ = withProjection(defaultViewName)

  const removeSource = addSource(
    Observable.create(observer => {
      if (!currentViewName$.value) {
        observer.next(
          viewChanged(defaultViewName$.value || UNDEFINED_VIEW_NAME),
        )
      }
      observer.complete()
    }),
  )

  const replaceViewSubscription = withProjection(replacementViewName).subscribe(
    viewName => viewName && dispatch(viewChanged(viewName)),
  )

  return () => {
    removeSource()
    replaceViewSubscription.unsubscribe()
  }
}
