import { subscribeEvent } from '../libs/browser/subscribeEvent'

import { currentView } from '../projections/currentView'
import { changed } from '../events/view'

const UNDEFINED_VIEW_NAME = 'UndefinedView'

const getCurrentUrlView = () => window.location.pathname.replace(/^\//, '')

export const createUrlbarEffect = (viewNames) => {
  return function urlbar({ addSource, dispatch, withProjection }) {
    withProjection(currentView).connect()

    const removeSource = addSource([
      changed({
        view: getCurrentUrlView() || viewNames[0] || UNDEFINED_VIEW_NAME,
      }),
    ])

    const projectionSubscription = withProjection(currentView).subscribe(
      (newView) => {
        if (newView === getCurrentUrlView()) {
          // view already in url bar, no need to push it
          // This can happen in case user uses any history manipulation interface (back/forward buttons...)
          return
        }

        window.history.pushState({ view: newView }, newView, newView)
      },
    )

    const popstateUnsubscribe = subscribeEvent(window, 'popstate', () =>
      dispatch(changed({ view: getCurrentUrlView() })),
    )

    return () => {
      projectionSubscription.unsubscribe()
      popstateUnsubscribe()
      removeSource()
    }
  }
}
