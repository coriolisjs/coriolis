import { createStore } from '../../..'

import { matchCoriolisEffectAPI } from '../../utils'

describe('Effect addSource', () => {
  it(`Given a spy effect function
      With a source added emitting one event
      When store is created
      Then the spy effect can catch this event on pastEvent$`, () => {
    const spyPastEvents = sinon.spy()
    const spyEffect = sinon.spy(({ addSource, pastEvent$ }) => {
      addSource([{ type: 'event' }])
      pastEvent$.subscribe(spyPastEvents)
    })

    const stopStore = createStore(spyEffect)

    expect(stopStore).to.be.a('function')
    expect(spyEffect).to.have.been.calledOnce()
    expect(spyEffect).to.have.been.calledWith(matchCoriolisEffectAPI)
    expect(spyPastEvents).to.have.been.calledWith(
      sinon.match({ type: 'event' }),
    )

    stopStore()
  })
})
