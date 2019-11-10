import { createStore } from '../..'

import {
  matchFirstEvent
} from '../utils'

describe('Effect withAggr', () => {
  it(`Given a reducer with a length=0 signature
      When this reducer is piped
      Then it is tested as an aggregator setup
      And then it is finally used as a reducer
  `, () => {
    const reducer = sinon.stub().returns('state')
    const dataSpy = sinon.spy()

    const store = createStore(({ withAggr }) => {
      withAggr(reducer).subscribe(dataSpy)
    })

    expect(reducer, 'reducer').to.have.been.calledWith(undefined, {
      type: 'All initial events have been read',
      payload: {},
      meta: sinon.match.object
    })
    expect(dataSpy, 'dataSpy').to.have.been.calledWith('state')

    expect(store).to.be.a('function')
  })

  it(`Given a reducer with a length=1 signature
      When this reducer is piped
      Then it is used as a reducer with the initial coriolis event
  `, () => {
    const reducer = sinon.stub().returns('state')
    const dataSpy = sinon.spy()

    const store = createStore(({ withAggr }) => {
      withAggr(reducer).subscribe(dataSpy)
    })

    expect(reducer, 'reducer').to.have.been.calledWith(undefined, matchFirstEvent)
    expect(dataSpy, 'dataSpy').to.have.been.calledWith('state')

    expect(store).to.be.a('function')
  })
})
