import { Observable, merge } from 'rxjs'
import { FIRST_EVENT_TYPE } from '..'

export const matchSubject = sinon.match({
  subscribe: sinon.match.func,
  next: sinon.match.func
})

export const matchObservable = sinon.match({
  subscribe: sinon.match.func
})

export const matchFirstEvent = sinon.match({
  type: FIRST_EVENT_TYPE
})

export const matchCoriolisEffectAPI = sinon.match({
  eventSource: matchSubject,
  addSource: sinon.match.func,
  addLogger: sinon.match.func,
  addEffect: sinon.match.func,
  withAggr: sinon.match.func,
  initialEvent$: matchObservable
})

export const matchCoriolisAggregatorSetupAPI = sinon.match({
  useAggr: sinon.match.func,
  useEvent: sinon.match.func,
  useState: sinon.match.func
})

export const createTrackedObservable = observable => {
  const unsubscribeSpy = sinon.spy()
  const subscribeSpy = sinon.stub().returns(unsubscribeSpy)

  const spyObservable = merge(
    observable,
    Observable.create(subscribeSpy)
  )

  return {
    spyObservable,
    subscribeSpy,
    unsubscribeSpy
  }
}

export const randomEventsObservable = Observable.create(observer => {
  let timeout
  const next = () => {
    observer.next({ type: Math.random().toString(36).substring(2, 15) })
    timeout = setTimeout(next, Math.random() * 10)
  }
  next()

  return () => clearTimeout(timeout)
})
