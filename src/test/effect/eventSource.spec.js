import { of } from 'rxjs'

import { createStore } from '../..'

import {
  matchFirstEvent,
  createTrackedObservable,
  randomEventsObservable
} from '../utils'

describe('Effect eventSource', () => {
  it(`Given a spy effect
      with an infinit source of events sent to eventSource subject
      When store is created
      Then calling the returned stop function should stop everything
  `, () => {
    const {
      spyObservable: infinitSource,
      subscribeSpy,
      unsubscribeSpy
    } = createTrackedObservable(randomEventsObservable)

    const spyeffect = sinon.spy(({ eventSource }) => {
      return infinitSource.subscribe(eventSource)
    })

    const stopStore = createStore(spyeffect)

    stopStore()

    expect(subscribeSpy).to.have.been.calledOnce()
    expect(unsubscribeSpy).to.have.been.calledOnce()
  })

  it(`Given a store with an effect
      When the effect subscribes to eventSource
      Then it receives the coriolis first event
  `, () => {
    const spy = sinon.spy()

    const effect = sinon.spy(({ eventSource }) => {
      eventSource.subscribe(spy)
    })

    createStore(effect)

    expect(spy).to.have.been.calledOnce()
    expect(spy).to.have.been.calledWith(matchFirstEvent)
  })

  it(`Given a store with an effect
      When the effect dispatches an event on eventSource
      Then it receives it from eventSource
  `, () => {
    const spy = sinon.spy()

    const effect = ({ eventSource }) => {
      eventSource.subscribe(spy)
      eventSource.next({ type: 'type' })
    }

    createStore(effect)

    expect(spy).to.have.been.calledTwice()
    expect(spy).to.have.been.calledWith(matchFirstEvent)
    expect(spy).to.have.been.calledWith(sinon.match({ type: 'type' }))
  })

  it(`Given a spy effect
      and a source of one event sent immediatly on subscription to eventSource subject
      When store is created
      Then output spy should receive the store first event and then the new event
  `, () => {
    const {
      spyObservable: oneEvent,
      subscribeSpy,
      unsubscribeSpy
    } = createTrackedObservable(of({ type: 'event' }))

    const effectEventSpy = sinon.spy()

    const spyeffect = sinon.spy(({ eventSource }) => {
      eventSource.subscribe(effectEventSpy)
      return oneEvent.subscribe(eventSource)
    })

    const stopStore = createStore(spyeffect)

    stopStore()

    expect(subscribeSpy).to.have.been.calledOnce()
    expect(unsubscribeSpy).to.have.been.calledOnce()
    expect(effectEventSpy).to.have.been.calledTwice()
    expect(effectEventSpy).to.have.been.calledWith(sinon.match({ type: 'event' }))
  })
})
