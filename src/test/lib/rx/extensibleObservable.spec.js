import { from, interval } from 'rxjs'
import { take } from 'rxjs/operators'

import { createExtensibleObservable } from '../../../lib/rx/extensibleObservable'

xdescribe('extensibleObservable', () => {
  it('should behave as expected 1', () => {
    const eventSpy = sinon.spy()
    const errorSpy = sinon.spy()
    const completeSpy = sinon.spy()

    const { observable } = createExtensibleObservable()

    observable.subscribe(eventSpy, errorSpy, completeSpy)

    expect(eventSpy).not.to.have.been.called()
    expect(errorSpy).not.to.have.been.called()
    expect(completeSpy).to.have.been.calledOnce()
  })

  it('should behave as expected 2', () => {
    const eventSpy = sinon.spy()
    const errorSpy = sinon.spy()
    const completeSpy = sinon.spy()

    const { observable, add } = createExtensibleObservable()

    add(from([{}]))

    observable.subscribe(eventSpy, errorSpy, completeSpy)

    expect(eventSpy).to.have.been.calledWith(sinon.match({}))
    expect(errorSpy).not.to.have.been.called()
    expect(completeSpy).to.have.been.calledOnce()
  })

  it('should behave as expected', () => {
    const eventBeforeAddSpy = sinon.spy(() =>
      console.log('spy eventBeforeAddSpy'),
    )
    const errorBeforeAddSpy = sinon.spy(() =>
      console.log('spy errorBeforeAddSpy'),
    )
    const completeBeforeAddSpy = sinon.spy(() =>
      console.log('spy completeBeforeAddSpy'),
    )

    const eventAfterAddSpy = sinon.spy(() =>
      console.log('spy eventAfterAddSpy'),
    )
    const errorAfterAddSpy = sinon.spy(() =>
      console.log('spy errorAfterAddSpy'),
    )
    const completeAfterAddSpy = sinon.spy(() =>
      console.log('spy completeAfterAddSpy'),
    )

    const eventLastSpy = sinon.spy(() => console.log('spy eventLastSpy'))
    const errorLastSpy = sinon.spy(() => console.log('spy errorLastSpy'))
    const completeLastSpy = sinon.spy(() => console.log('spy completeLastSpy'))

    const { observable, add } = createExtensibleObservable()

    observable.subscribe(
      eventBeforeAddSpy,
      errorBeforeAddSpy,
      completeBeforeAddSpy,
    )

    add(interval(10).pipe(take(3)))

    observable.subscribe(
      eventAfterAddSpy,
      errorAfterAddSpy,
      completeAfterAddSpy,
    )

    setTimeout(() => {
      add(interval(10).pipe(take(4)))
      const removeSource = add(interval(10).pipe(take(10)))

      setTimeout(() => {
        removeSource()

        add(from(['a', 'b', 'c']))

        setTimeout(() => {
          observable.subscribe(eventLastSpy, errorLastSpy, completeLastSpy)
        }, 20)
      }, 20)
    }, 20)
  })
})
