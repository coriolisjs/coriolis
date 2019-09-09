import { createEventSource } from './eventSource'
import { createStore } from './eventStore'

const logEvent = event => console.log('✍ ', event)

const expectedType = 'expected type'
const expectedState = 'expected state'

const bugReducer = (state, { type, payload }) => {
  console.log('reducer', type, payload)
  if (type !== expectedType) {
    return state
  }

  console.log('currentView state changed', payload)
  return payload
}

const bugEffect = (eventSource, pipeReducer) => {
  pipeReducer(bugReducer)
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
    .add(
      eventSource.subscribe(event => console.log('effect got event', event))
    )
}

createStore(createEventSource([], logEvent))
  .addEffect(bugEffect)
  .init()
