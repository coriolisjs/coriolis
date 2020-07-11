import { isValidEvent } from '../../../lib/event/isValidEvent'

describe('isValidEvent', () => {
  it(`Given an valid event
      When isValidEvent is called with this event
      Then we get true
  `, () => {
    const validEvent = {
      type: 'type',
    }

    expect(isValidEvent(validEvent)).to.equal(true)
  })

  it(`Given an valid event with payload
      When isValidEvent is called with this event
      Then we get true
  `, () => {
    const validEvent = {
      type: 'type',
      payload: {},
    }

    expect(isValidEvent(validEvent)).to.equal(true)
  })

  it(`Given an valid event with meta
      When isValidEvent is called with this event
      Then we get true
  `, () => {
    const validEvent = {
      type: 'type',
      meta: {},
    }

    expect(isValidEvent(validEvent)).to.equal(true)
  })

  it(`Given an valid error event
      When isValidEvent is called with this event
      Then we get true
  `, () => {
    const validEvent = {
      type: 'type',
      error: true,
    }

    expect(isValidEvent(validEvent)).to.equal(true)
  })

  it(`Given an valid error event with payload and meta
      When isValidEvent is called with this event
      Then we get true
  `, () => {
    const validEvent = {
      type: 'type',
      error: true,
      payload: {},
      meta: {},
    }

    expect(isValidEvent(validEvent)).to.equal(true)
  })

  it(`Given an event with invalid property
      When isValidEvent is called with this event
      Then we get false
  `, () => {
    const validEvent = {
      type: 'type',
      any: true,
    }

    expect(isValidEvent(validEvent)).to.equal(false)
  })

  it(`Given an event with invalid meta
      When isValidEvent is called with this event
      Then we get false
  `, () => {
    const validEvent = {
      type: 'type',
      meta: true,
    }

    expect(isValidEvent(validEvent)).to.equal(false)
  })

  it(`Given an invalid event
      When isValidEvent is called with this event
      Then we get false
  `, () => {
    const invalidEvent = {}

    expect(isValidEvent(invalidEvent)).to.equal(false)
  })
})
