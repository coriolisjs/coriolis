import { chain } from '../../../lib/function/chain'

describe('chain', () => {
  it(`Given a list of function
      When chain is called with this list
      Then we get a new function
      And this function would call each function with all its arguments
      And it would return nothing
  `, () => {
    const spies = [
      sinon.spy(),
      sinon.spy(),
      sinon.spy(),
      sinon.spy(),
      sinon.spy(),
    ]

    const func = chain(...spies)

    const result = func('arg1', 'arg2', 'arg3')

    expect(result).to.be.undefined()

    spies.forEach((spy) => {
      expect(spy).to.have.been.calledWith('arg1', 'arg2', 'arg3')
    })
  })
})
