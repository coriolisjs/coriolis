import { subscribeEvent } from '../libs/browser/subscribeEvent'

import { currentView } from '../reducers/currentView'
import { changed } from '../events/view'

const getCurrentUrlView = () => location.pathname.replace(/^\//, '')

export const urlbar = ({ addSource, eventSource, pipeReducer }) => {
  const removeSource = addSource([changed({ view: getCurrentUrlView() })])

  const reducerSubscription = pipeReducer(currentView)
    .subscribe(newView => {
      if (newView === getCurrentUrlView()) {
        // view already in url bar, no need to push it
        return
      }

      history.pushState({}, newView, newView)
    })

  const popstateUnsubscribe = subscribeEvent(window, 'popstate', () =>
    eventSource.next(changed({ view: getCurrentUrlView() })))

  return () => {
    reducerSubscription.unsubscribe()
    popstateUnsubscribe()
    removeSource()
  }
}
