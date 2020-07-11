import { fromReducer } from '@coriolis/coriolis'
import { subscribeEvent } from '../libs/browser/subscribeEvent'

import { currentView } from '../projections/currentView'
import { changed } from '../events/view'

const UNDEFINED_VIEW_NAME = 'UndefinedView'

const getCurrentUrlView = () => window.location.pathname.replace(/^\//, '')

export const urlbar = (viewNames) => ({
  addSource,
  dispatch,
  withProjection,
}) => {
  const removeSource = addSource([
    changed({
      view: getCurrentUrlView() || viewNames[0] || UNDEFINED_VIEW_NAME,
    }),
  ])

  const projectionSubscription = withProjection(
    fromReducer(currentView),
  ).subscribe((newView) => {
    if (newView === getCurrentUrlView()) {
      // view already in url bar, no need to push it
      // if this happens, there's probably a view configuration problem
      // maybe a warning would be something to do here ?
      return
    }

    window.history.pushState({ view: newView }, newView, newView)
  })

  const popstateUnsubscribe = subscribeEvent(window, 'popstate', () =>
    dispatch(changed({ view: getCurrentUrlView() })),
  )

  return () => {
    projectionSubscription.unsubscribe()
    popstateUnsubscribe()
    removeSource()
  }
}
