import { subscribeEvent } from '../libs/browser/subscribeEvent'

import { currentView } from '../aggrs/currentView'
import { changed } from '../events/view'

const getCurrentUrlView = () => location.pathname.replace(/^\//, '')

export const urlbar = views => ({ addSource, eventSource, pipeAggr }) => {
  const removeSource = addSource([changed({ view: getCurrentUrlView() })])

  let previousView
  const aggrSubscription = pipeAggr(currentView)
    .subscribe(newView => {
      if (!views.includes(newView)) {
        const view = previousView || views[0]
        eventSource.next(changed({ view }))
        return
      }
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
