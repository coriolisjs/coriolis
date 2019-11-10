import { tryOrNull } from '../../../lib/function/tryOrNull'

describe('tryOrNull', () => {
  it(`Given a function not throwing an exception
      When we execute this function using tryOrNull
      Then we should get the result of that function
  `, () => {
    const stub = sinon.stub().returns('result')

    const result = tryOrNull(stub)

    expect(result).to.equal('result')
  })

  it(`Given a function throwing an exception
      When we execute this function using tryOrNull
      Then we should get the result of that function
  `, () => {
    const stub = sinon.stub().throws('error')

    const result = tryOrNull(stub)

    expect(result).to.equal(null)
  })
})
