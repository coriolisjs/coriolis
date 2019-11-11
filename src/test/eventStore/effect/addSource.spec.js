import { createStore } from '../../..'

import {
  matchCoriolisEffectAPI
} from '../../utils'

describe('Effect addSource', () => {
  it(`Given a spy effect function
      With a source added emitting one event
      When store is created
      Then the spy effect can catch this event on initialEvent$`, () => {
    const spyInitialEvents = sinon.spy()
    const spyEffect = sinon.spy(({ addSource, initialEvent$ }) => {
      addSource([{ type: 'event' }])
      initialEvent$.subscribe(spyInitialEvents)
    })

    const stopStore = createStore(spyEffect)

    expect(stopStore).to.be.a('function')
    expect(spyEffect).to.have.been.calledOnce()
    expect(spyEffect).to.have.been.calledWith(matchCoriolisEffectAPI)
    expect(spyInitialEvents).to.have.been.calledWith(sinon.match({ type: 'event' }))

    stopStore()
  })
})
