import { subscribeEvent } from '../libs/browser/subscribeEvent'

import { currentView } from '../aggrs/currentView'
import { changed } from '../events/view'

const UNDEFINED_VIEW_NAME = 'UndefinedView'

const getCurrentUrlView = () => location.pathname.replace(/^\//, '')

export const urlbar = viewNames => ({ addSource, eventSource, withAggr }) => {
  const removeSource = addSource([changed({ view: getCurrentUrlView() || viewNames[0] || UNDEFINED_VIEW_NAME })])

  const aggrSubscription = withAggr(currentView)
    .subscribe(newView => {
      if (newView === getCurrentUrlView()) {
        // view already in url bar, no need to push it
        // if this happens, there's probably a view configuration problem
        // maybe a warning would be something to do here ?
        return
      }

      history.pushState({ view: newView }, newView, newView)
    })

  const popstateUnsubscribe = subscribeEvent(window, 'popstate', () =>
    eventSource.next(changed({ view: getCurrentUrlView() })))

  return () => {
    aggrSubscription.unsubscribe()
    popstateUnsubscribe()
    removeSource()
  }
}
