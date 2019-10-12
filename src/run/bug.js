import { createStore } from '../eventStore'

const logEvent = event => console.log('✍ ', event)

const expectedType = 'expected type'
const expectedState = 'expected state'

const bugAggr = ({ useState, useEvent }) => (
  useState(),
  useEvent(),
  (state, { type, payload }) => {
    console.log('aggr', type, payload)
    if (type !== expectedType) {
      return state
    }

    console.log('state changed', payload)
    return payload
  }
)

const bugEffect = ({ addLogger, eventSource, withAggr }) => {
  const removeLogger = addLogger(logEvent)
  const sourceSubscription = eventSource.subscribe(event => console.log('effect got event', event))

  return withAggr(bugAggr)
    .subscribe(reducedState => {
      console.log('effect got state', reducedState)
      if (reducedState !== expectedState) {
        console.log('dispatch event to get houra')
        eventSource.next({ type: expectedType, payload: expectedState })
        console.log('dispatch done')
        return
      }

      console.log('Houra !!')
    })
    .add(sourceSubscription)
    .add(() => removeLogger())
}

createStore(
  bugEffect
)
