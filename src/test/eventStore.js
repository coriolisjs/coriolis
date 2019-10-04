import { createStore } from '..'

import { matchCoriolisEffectAPI } from './utils'

describe(`Coriolis event store
  Basic store creation and destroy behaviors
`, () => {
  describe('destroy store', () => {
    it(`Given a store is created
        When the returned function is executed
        Then the store is destroyed`, () => {
      const destroyStore = createStore(() => {})

      destroyStore()
    })
  })

  it(`Given no effect function
      When store is created
      Then an error should explain that an app without effect is useless`, () => {
    expect(() => createStore()).to.throw()
  })

  it(`Given a spy effect function
      When store is created
      Then the spy effect have been called with the expected API
      And then returned value is a function (to stop the store)`, () => {
    const spyDestroy = sinon.spy()
    const spyEffect = sinon.spy(() => spyDestroy)

    const stopStore = createStore(spyEffect)

    expect(stopStore).to.be.a('function')
    expect(spyEffect).to.have.been.calledOnce()
    expect(spyEffect).to.have.been.calledWith(matchCoriolisEffectAPI)
    expect(spyDestroy).not.to.have.been.called()

    stopStore()

    expect(spyDestroy).to.have.been.calledOnce()
  })
})
