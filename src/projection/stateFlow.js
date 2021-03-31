import { distinctUntilChanged, map, skipUntil, tap } from 'rxjs/operators'

import { setValueGetter } from '../lib/object/valueGetter'
import { simpleUnsub } from '../lib/rx/simpleUnsub'

import { getStateValue } from './reducedProjection'

const useState = (initialState) => {
  let state = initialState

  return {
    getState: () => state,
    setState: (newState) => (state = newState),
  }
}

export const createStateFlow = (reducedProjection, event$, skipUntil$) => {
  const { getState, setState } = useState(reducedProjection)

  const getValue = () => getStateValue(getState())
  const getNextState = (event) => getState().getNextState(event)
  const getNextValue = (event) => getStateValue(setState(getNextState(event)))

  const state$ = event$.pipe(
    map(getNextState),
    tap(setState),

    // while init is not finished (past events replaying), we expect projections to
    // get all events, but we don't want any new state emited (it's not new states, it's past state rebuilding)
    skipUntil(skipUntil$),

    map(getStateValue),
    distinctUntilChanged(),
  )

  // We don't return directly subscription because user is not aware it's an observable under the hood
  // For user, the request is to connect a stateFlow, it should return a function to disconnect it
  state$.connect = !reducedProjection.stateless
    ? () => simpleUnsub(state$.subscribe())
    : // for stateless reducedProjection, connect or disconnect is useless
      // TODO: Maybe a warning in this case could be a good idea ?
      () =>
        console.warn(
          `connecting a stateless projection (${
            reducedProjection.name || 'unnamed'
          }) is useless.
Maybe you intended to connect a statefull projection this one depends on ?`,
        )

  setValueGetter(state$, getValue)

  return {
    name: reducedProjection.name,
    internal: {
      getValue,
      getNextValue,
    },
    external: state$,
  }
}
