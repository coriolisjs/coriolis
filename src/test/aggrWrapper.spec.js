// import { createAggrWrapperFactory } from '../aggrWrapper'

describe('aggrWrapperFactory', () => {
  describe('get', () => {
    it('Creates an aggrWrapper (an Observable-like instance) from an aggr')

    it('Returns always the same aggrWrapper from the same aggr')
  })

  describe('aggrWrapper', () => {
    it('Is an observable of applying aggr\'s matching aggregator with each event')

    it('Apply aggregator with events even before skipUntil$ has emitted')

    it('Emits aggregator results only once skipUntil$ has emitted')

    it('Emits only if aggr result is different from the previous one')

    describe('connect', () => {
      it('Applies aggregator with events without need of a subscriber')

      it('Returns a disconnect function disabeling the aggregator calls')
    })

    describe('getValue / get value', () => {
      it('Gets the aggregator\'s current value')
    })
  })
})
