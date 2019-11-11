// import { createAggregator, createAggregatorFactory } from '../aggregator'

describe('aggregator', () => {
  describe('from reducer aggr', () => {
    it('Gets new state from each event, using previous state and given reducer function')

    it('Gets previous state if the same event is dispatched twice in a raw')

    it('Gets previous state if no event is given')
  })

  describe('from complex aggr', () => {
    describe('useState', () => {
      it('Gives access to previous state')
      it('Gives a way to set initial state')
    })

    describe('useEvent', () => {
      it('Makes aggr executed on every event')
      it('Makes aggr executed on every event of a given type')
      it('Makes aggr executed on every event within given types')
    })

    describe('useAggr', () => {
      it('Makes aggr executed each time given aggr\'s result changes (if useEvent not used)')
      it('Gives access to aggr\'s last result')
    })

    describe('lazyAggr', () => {
      it('Doesn\'t make aggr executed each time aggr\'s result changes')
      it('Gives access to aggr\'s last result')
    })

    describe('useValue', () => {
      it('Gives access to a static value')
    })
  })

  describe('initialState', () => {
    it('Gets agregator\'s initial state')
  })

  describe('getValue', () => {
    it('Gets agregator\'s last result value')
  })
})

describe('aggregatorFactory', () => {
  describe('get', () => {
    it('Creates aggregators with it\'s own get function')
    it('handles specific aggr snapshot')
  })
})
