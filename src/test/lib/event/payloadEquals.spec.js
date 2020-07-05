import { payloadEquals } from '../../../lib/event/payloadEquals'

describe('payloadEquals', () => {
  it(`Given an event
      When payloadEquals is called with event payload's content
      Then we get true
  `, () => {
    const event = {
      type: 'type',
      payload: 'value',
    }

    expect(payloadEquals('value')(event)).to.equal(true)
  })

  it(`Given an event
      When payloadEquals is called with a different value then event payload's content
      Then we get false
  `, () => {
    const event = {
      type: 'type',
      payload: 'value',
    }

    expect(payloadEquals('other value')(event)).to.equal(false)
  })
})
