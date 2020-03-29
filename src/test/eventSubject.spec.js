import { map } from 'rxjs/operators'
import { createEventSubject } from '../eventSubject'

describe('eventSubject', () => {
  it(`Basic event dispatch

      Given an eventSubject
      When an event is dispatched
      Then this event will be received by subscribers
  `, () => {
    const eventsSpy = sinon.spy()

    const eventSubject = createEventSubject()

    const subscription = eventSubject.subscribe(eventsSpy)

    eventSubject.next({ type: 'event type' })
    subscription.unsubscribe()

    expect(eventsSpy).to.have.been.calledWith(
      sinon.match({ type: 'event type' }),
    )
  })

  it(`Invalid events handling

      Given an eventSubject
      When an invalid event is dispatched
      Then an error is raised
  `, () => {
    const eventsSpy = sinon.spy()
    const errorSpy = sinon.spy()
    const completeSpy = sinon.spy()

    const eventSubject = createEventSubject()

    const subscription = eventSubject.subscribe(
      eventsSpy,
      errorSpy,
      completeSpy,
    )

    eventSubject.next({ no: 'event type' })
    subscription.unsubscribe()

    expect(eventsSpy).not.to.have.been.called()
    expect(errorSpy).to.have.been.calledOnce()
    expect(completeSpy).not.to.have.been.called()
  })

  it(`Prevent loops

      Given an eventSubject
      When an event is dispatched
      And a subscriber dispatches again this event
      Then an error is raised
  `, () => {
    const eventsSpy = sinon
      .stub()
      .callsFake((event) => eventSubject.next(event))
    const errorSpy = sinon.spy()
    const completeSpy = sinon.spy()

    const eventSubject = createEventSubject()

    const subscription = eventSubject.subscribe(
      eventsSpy,
      errorSpy,
      completeSpy,
    )

    eventSubject.next({ type: 'event type' })
    subscription.unsubscribe()

    expect(eventsSpy).to.have.been.calledOnce()
    expect(eventsSpy).to.have.been.calledWith(
      sinon.match({ type: 'event type' }),
    )
    expect(errorSpy).to.have.been.calledOnce()

    expect(completeSpy).not.to.have.been.called()
  })

  it(`Buffering first events

      Given an eventSubject
      When an event is dispatched before any subscriber subscribes
      Then First subscriber will get the event on subscription
  `, () => {
    const eventsSpy = sinon.spy()

    const eventSubject = createEventSubject()

    eventSubject.next({ type: 'event type' })
    const subscription = eventSubject.subscribe(eventsSpy)
    subscription.unsubscribe()

    expect(eventsSpy).to.have.been.calledWith(
      sinon.match({ type: 'event type' }),
    )
  })

  // Previous test asserts buffering of events before any subscription.
  // we still have to test buffering of new events is done while past events
  // are being emitted

  it(`Timestamp every new event

      Given an eventSubject
      When an event is dispatch on it
      Then subscribers receive the event with a timestamp in meta-data
    `, () => {
    const eventsSpy = sinon.spy()

    const eventSubject = createEventSubject()

    eventSubject.next({ type: 'event type' })

    const subscription = eventSubject.subscribe(eventsSpy)
    subscription.unsubscribe()

    expect(eventsSpy).to.have.been.calledWith(
      sinon.match({
        type: 'event type',
        meta: { timestamp: sinon.match(Number) },
      }),
    )
  })

  // To add: events dispatched with already a timestamp should keep existing timestamp

  it(`Enhancer can be setup to enhance every new event

      Given an eventSubject created with an enhancer (rx pipable operator)
      When an event is dispatched
      Then the enhancer is executed
      And changes done by enhancer on the event are passed to subscribers
      And the event has already been timestamped before enhancer
  `, () => {
    const eventsSpy = sinon.spy()
    const enhancerMapStub = sinon
      .stub()
      .callsFake((event) => ({ ...event, payload: 'enhanced payload' }))
    const enhancer = map(enhancerMapStub)

    const eventSubject = createEventSubject(undefined, undefined, enhancer)

    eventSubject.next({ type: 'event type' })

    const subscription = eventSubject.subscribe(eventsSpy)
    subscription.unsubscribe()

    expect(eventsSpy).to.have.been.calledWith(
      sinon.match({ type: 'event type', payload: 'enhanced payload' }),
    )
    expect(enhancerMapStub).to.have.been.calledWith(
      sinon.match({
        type: 'event type',
        meta: { timestamp: sinon.match(Number) },
      }),
    )
  })

  it(`LogObserver logs events

      Given an eventSubject created with a logObserver function parameter
      When an event is dispatched
      Then the logObserver function is called with this event
      And the event has already been timestamped and enhanced
  `, () => {
    const eventsSpy = sinon.spy()
    const logSpy = sinon.spy()
    const enhancerStub = sinon
      .stub()
      .callsFake(map((event) => ({ ...event, payload: 'enhanced payload' })))

    const eventSubject = createEventSubject(undefined, logSpy, enhancerStub)

    eventSubject.next({ type: 'event type' })

    const subscription = eventSubject.subscribe(eventsSpy)
    subscription.unsubscribe()

    expect(eventsSpy).to.have.been.calledWith(
      sinon.match({ type: 'event type' }),
    )
    expect(logSpy).to.have.been.calledWith(
      sinon.match({
        type: 'event type',
        payload: 'enhanced payload',
        meta: { timestamp: sinon.match(Number) },
      }),
    )
  })

  // To add: logObserver can emit events

  // To add: tests on pastSource
  it('should contain more tests')
})
