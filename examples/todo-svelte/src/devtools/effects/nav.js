import { currentView } from '../aggrs/currentView'
import { viewChanged } from '../events'

export const createNav = views => ({ pipeAggr, addSource, eventSource }) => {
  const removeSource = addSource([viewChanged(views[0] || 'undefined-view')])

  let previousView

  const currentViewSubscription = pipeAggr(currentView)
    .subscribe(newView => {
      if (views.includes(newView)) {
        previousView = newView
        return
      }

      const replacementView = (previousView && newView !== previousView)
        ? previousView
        : views[0]

      if (replacementView) {
        previousView = replacementView
        eventSource.next(viewChanged(replacementView))
      }
    })

  return () => {
    removeSource()
    currentViewSubscription.unsubscribe()
  }
}
