import { currentView } from '../reducers/currentView'
import { changed } from '../events/view'

const subscribeEvent = (node, eventName, listener, capture = false) => {
  node.addEventListener(eventName, listener, capture)

  return () => {
    node.removeEventListener(eventName, listener, capture)
  }
}

const currentUrlView = () => location.pathname.replace(/^\//, '')

export const createUrlbar = () => {
  // Do anything to setup this effect handler

  return (eventSource, pipeReducer) => {
    pipeReducer(currentView).subscribe(newView => {
      if (newView === currentUrlView()) {
        // view already in url bar, no need to push it
        return
      }

      history.pushState({}, newView, newView)
    })

    return subscribeEvent(window, 'popstate', () =>
      eventSource.next(changed({ view: currentUrlView() })))
  }
}
