import { createStore } from '../..'

import { matchCoriolisEffectAPI } from '../utils'

describe(`Coriolis event store
  Basic store creation and destroy behaviors
`, () => {
  describe('destroy store', () => {
    it(`Given a store is created
        When the returned destroyStore function is executed
        Then the store is destroyed
    `, () => {
      const { destroyStore } = createStore(() => {})

      destroyStore()
    })
  })

  it(`Given a spy effect function
      When store is created
      Then the spy effect have been called with the expected API
      And the returned object contains a destroyStore function (to stop the store)
      And the returned object contains a addEffect function
  `, () => {
    const spyDestroy = sinon.spy()
    const spyEffect = sinon.spy(() => spyDestroy)

    const { destroyStore, addEffect } = createStore(spyEffect)

    expect(destroyStore).to.be.a('function')
    expect(addEffect).to.be.a('function')
    expect(spyEffect).to.have.been.calledOnce()
    expect(spyEffect).to.have.been.calledWith(matchCoriolisEffectAPI)
    expect(spyDestroy).not.to.have.been.called()

    destroyStore()

    expect(spyDestroy).to.have.been.calledOnce()
  })
})
