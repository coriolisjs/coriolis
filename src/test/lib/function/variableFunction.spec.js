import { variableFunction } from '../../../lib/function/variableFunction'

describe('variableFunction', () => {
  it(`Given a function
      When I create a variableFunction with it
      Then I get a func
      And if I excecute this func it executes the initial function with all params
      And the returned value would be passed
  `, () => {
    const stub = sinon.stub().returns('result')

    const { func } = variableFunction(stub)

    const result = func('arg')

    expect(stub).to.have.been.calledWith('arg')
    expect(result).to.equal('result')
  })

  it(`Given a function
      When I create a variableFunction with it
      And I give another function to the setup function
      Then if I excecute the func it executes the other function with all params
      And the returned value would be passed from this other function
      And initial function would not be called
  `, () => {
    const stub = sinon.stub().returns('result')
    const otherStub = sinon.stub().returns('other result')

    const {
      func,
      setup
    } = variableFunction(stub)

    setup(otherStub)
    const result = func('arg')

    expect(stub).not.to.have.been.called()
    expect(otherStub).to.have.been.calledWith('arg')
    expect(result).to.equal('other result')
  })

  it(`Given a function
      When I create a variableFunction with it
      And I first call it
      And I give another function to the setup function
      And I call it again
      Then initial function should have been called first
      And the other function should have been called then
  `, () => {
    const stub = sinon.stub().returns('result')
    const otherStub = sinon.stub().returns('other result')

    const {
      func,
      setup
    } = variableFunction(stub)

    const result1 = func('arg1')
    setup(otherStub)
    const result2 = func('arg2')

    expect(stub).to.have.been.calledOnce()
    expect(stub).to.have.been.calledWith('arg1')
    expect(result1).to.equal('result')

    expect(otherStub).to.have.been.calledOnce()
    expect(otherStub).to.have.been.calledWith('arg2')
    expect(result2).to.equal('other result')
  })
})
