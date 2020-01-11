// import { createProjectionWrapperFactory } from '../projectionWrapper'

describe('projectionWrapperFactory', () => {
  describe('get', () => {
    it('Creates an projectionWrapper (an Observable-like instance) from an projection')

    it('Returns always the same projectionWrapper from the same projection')
  })

  describe('projectionWrapper', () => {
    it('Is an observable of applying projection\'s matching aggregator with each event')

    it('Apply aggregator with events even before skipUntil$ has emitted')

    it('Emits aggregator results only once skipUntil$ has emitted')

    it('Emits only if projection result is different from the previous one')

    describe('connect', () => {
      it('Applies aggregator with events without need of a subscriber')

      it('Returns a disconnect function disabeling the aggregator calls')
    })

    describe('getValue / get value', () => {
      it('Gets the aggregator\'s current value')
    })
  })
})
