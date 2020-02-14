// import { createAggregator, createAggregatorFactory } from '../aggregator'

describe('aggregator', () => {
  describe('useState', () => {
    it('Gives access to previous state')
    it('Gives a way to set initial state')
  })

  describe('useEvent', () => {
    it('Makes projection executed on every event')
    it('Makes projection executed on every event of a given type')
    it('Makes projection executed on every event within given types')
  })

  describe('useProjection', () => {
    it(
      "Makes projection executed each time given projection's result changes (if useEvent not used)",
    )
    it("Gives access to projection's last result")
  })

  describe('lazyProjection', () => {
    it("Doesn't make projection executed each time projection's result changes")
    it("Gives access to projection's last result")
  })

  describe('useValue', () => {
    it('Gives access to a static value')
  })

  describe('getValue', () => {
    it("Gets agregator's last result value")
  })
})

describe('aggregatorFactory', () => {
  describe('get', () => {
    it("Creates aggregators with it's own get function")
    it('handles specific projection snapshot')
  })
})
