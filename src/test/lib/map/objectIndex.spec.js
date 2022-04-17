import { createIndex } from '../../../lib/map/objectIndex'

describe('ObjectIndex', () => {
  describe('With single parameter', () => {
    it(`Given an object index
        When this index is called various times with one parameter each time
        Then it returns indexed values
        And it calls creator only once per indexed key
        And a list of all indexed values can be reached
    `, () => {
      const obj1 = { prop1: 'value1' }
      const obj2 = { prop2: 'value2' }

      const resultObj1 = { propX: 'valueX' }
      const resultObj2 = { propY: 'valueY' }

      const creator = sinon.stub()

      const { get, list } = createIndex(creator)

      creator.returns(resultObj1)
      const result = get(obj1)

      expect(result).to.equal(resultObj1)
      expect(creator).to.have.been.calledOnce()
      expect(creator).to.have.been.calledWith(obj1)

      const result2 = get(obj1)

      expect(result2).to.equal(resultObj1)
      expect(creator).to.have.been.calledOnce()

      creator.returns(resultObj2)
      const result3 = get(obj2)

      expect(result3).to.equal(resultObj2)
      expect(creator).to.have.been.calledTwice()

      const result4 = get(obj2)

      expect(result4).to.equal(resultObj2)
      expect(creator).to.have.been.calledTwice()

      expect(list()).to.deep.equal([
        [[obj1], resultObj1],
        [[obj2], resultObj2],
      ])
    })
  })

  describe('with multiple parameters', () => {
    it(`Given an object index
        When this index is called various times with multiple parameters each time
        Then it returns indexed values
        And it calls creator only once per indexed key combination
        And a list of all indexed values can be reached
    `, () => {
      const obj1 = { prop: 'value' }
      const obj2 = { prop2: 'value2' }
      const obj3 = { prop3: 'value3' }
      const obj4 = { prop4: 'value4' }
      const obj5 = { prop5: 'value5' }

      const resultObj1 = { propX: 'valueX' }
      const resultObj2 = { propY: 'valueY' }
      const resultObj3 = { propZ: 'valueZ' }
      const resultObj4 = { propA: 'valueA' }

      const creator = sinon.stub()

      const { get, list } = createIndex(creator)

      creator.returns(resultObj1)
      const result = get(obj1, obj2)

      expect(result).to.equal(resultObj1)
      expect(creator).to.have.been.calledOnce()
      expect(creator).to.have.been.calledWith(obj1, obj2)

      const result2 = get(obj1, obj2)

      expect(result2).to.equal(resultObj1)
      expect(creator).to.have.been.calledOnce()

      creator.returns(resultObj2)
      const result3 = get(obj3, obj4, obj5)

      expect(result3).to.equal(resultObj2)
      expect(creator).to.have.been.calledTwice()
      expect(creator).to.have.been.calledWith(obj3, obj4, obj5)

      const result4 = get(obj3, obj4, obj5)

      expect(result4).to.equal(resultObj2)
      expect(creator).to.have.been.calledTwice()

      creator.returns(resultObj3)
      const result5 = get(obj1, obj3, obj5)

      expect(result5).to.equal(resultObj3)
      expect(creator).to.have.been.calledThrice()
      expect(creator).to.have.been.calledWith(obj1, obj3, obj5)

      const result6 = get(obj1, obj3, obj5)

      expect(result6).to.equal(resultObj3)
      expect(creator).to.have.been.calledThrice()

      creator.returns(resultObj4)
      const result7 = get(obj1, obj2, obj5)

      expect(result7).to.equal(resultObj4)
      expect(creator).to.have.callCount(4)
      expect(creator).to.have.been.calledWith(obj1, obj2, obj5)

      expect(list()).to.deep.equal([
        [[obj1, obj2], resultObj1],
        [[obj1, obj2, obj5], resultObj4],
        [[obj1, obj3, obj5], resultObj3],
        [[obj3, obj4, obj5], resultObj2],
      ])
    })
  })
})
