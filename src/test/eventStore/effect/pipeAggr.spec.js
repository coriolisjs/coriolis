import { createStore } from '../../..'

import { matchFirstEvent, matchCoriolisAggregatorSetupAPI } from '../../utils'

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

    expect(reducer, 'reducer').to.have.callCount(2)
    expect(reducer.firstCall, 'reducer').to.have.been.calledWith(
      matchCoriolisAggregatorSetupAPI
    )
    expect(reducer.secondCall, 'reducer').to.have.been.calledWith(
      undefined,
      matchFirstEvent
    )
    expect(dataSpy, 'dataSpy').to.have.been.calledWith('state')

    expect(store).to.be.a('function')
  })

  it(`Given a reducer with a length=1 signature
      When this reducer is piped
      Then it is tested as an aggregator setup
      And finally it is used as a reducer with the initial coriolis event
  `, () => {
    const reducer = sinon.stub().returns('state')
    const dataSpy = sinon.spy()

    Object.defineProperty(reducer, 'length', {
      value: 1,
      writable: false
    })

    const store = createStore(({ withAggr }) => {
      withAggr(reducer).subscribe(dataSpy)
    })

    expect(reducer, 'reducer').to.have.callCount(2)
    expect(reducer.firstCall, 'reducer').to.have.been.calledWith(
      matchCoriolisAggregatorSetupAPI
    )
    expect(reducer.secondCall, 'reducer').to.have.been.calledWith(
      undefined,
      matchFirstEvent
    )
    expect(dataSpy, 'dataSpy').to.have.been.calledWith('state')

    expect(store).to.be.a('function')
  })

  it(`Given a reducer with a length=2 signature
      When this reducer is piped
      Then it is not tested as an aggregator setup
      And it is used as a reducer with the initial coriolis event
  `, () => {
    const reducer = sinon.stub().returns('state')
    const dataSpy = sinon.spy()

    Object.defineProperty(reducer, 'length', {
      value: 2,
      writable: false
    })

    const store = createStore(({ withAggr }) => {
      withAggr(reducer).subscribe(dataSpy)
    })

    expect(reducer, 'reducer').to.have.callCount(1)
    expect(reducer, 'reducer').to.have.been.calledWith(
      undefined,
      matchFirstEvent
    )
    expect(dataSpy, 'dataSpy').to.have.been.calledWith('state')

    expect(store).to.be.a('function')
  })
})
