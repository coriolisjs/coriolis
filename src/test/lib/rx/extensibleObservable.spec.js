import { from, interval } from 'rxjs'
import { take } from 'rxjs/operators'

import { createExtensibleObservable } from '../../../lib/rx/extensibleObservable'

describe('extensibleObservable', () => {
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

  xit('should behave as expected', (done) => {
    const eventBeforeAddSpy = sinon.spy((...args) =>
      console.log('spy eventBeforeAddSpy', args),
    )
    const errorBeforeAddSpy = sinon.spy((...args) =>
      console.log('spy errorBeforeAddSpy', args),
    )
    const completeBeforeAddSpy = sinon.spy((...args) =>
      console.log('spy completeBeforeAddSpy', args),
    )

    const eventAfterAddSpy = sinon.spy((...args) =>
      console.log('spy eventAfterAddSpy', args),
    )
    const errorAfterAddSpy = sinon.spy((...args) =>
      console.log('spy errorAfterAddSpy', args),
    )
    const completeAfterAddSpy = sinon.spy((...args) =>
      console.log('spy completeAfterAddSpy', args),
    )

    const eventLastSpy = sinon.spy((...args) =>
      console.log('spy eventLastSpy', args),
    )
    const errorLastSpy = sinon.spy((...args) =>
      console.log('spy errorLastSpy', args),
    )
    const completeLastSpy = sinon.spy((...args) =>
      console.log('spy completeLastSpy', args),
    )

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

    setTimeout(done, 1000)
  })
})
