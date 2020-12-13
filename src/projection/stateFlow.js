import { distinctUntilChanged, map, skipUntil, tap } from 'rxjs/operators'

import { setValueGetter } from '../lib/object/valueGetter'
import { simpleUnsub } from '../lib/rx/simpleUnsub'

import { getStateValue } from './reducerState'

export const createStateFlow = (reducerState, event$, skipUntil$) => {
  let currentState = reducerState

  const memoState = (state) => (currentState = state)

  // Those two functions must use closure to currentState to be sure to
  // get the right state value when currentState value changes
  const getValue = () => getStateValue(currentState)
  const getNextState = (event) => currentState.getNextState(event)

  const state$ = event$.pipe(
    map(getNextState),
    tap(memoState),

    // while init is not finished (past events replaying), we expect projections to
    // get all events, but we don't want any new state emited (it's not new states, it's past state rebuilding)
    skipUntil(skipUntil$),

    map(getStateValue),
    distinctUntilChanged(),
  )

  // We don't return directly subscription because user is not aware it's an observable under the hood
  // For user, the request is to connect an aggregator, it should return a function to disconnect it
  state$.connect = () => simpleUnsub(state$.subscribe())

  setValueGetter(state$, getValue)

  return {
    name: reducerState.name,
    internal: {
      withEvent: (event) => getStateValue(memoState(getNextState(event))),
      getValue,
    },
    external: state$,
  }
}
