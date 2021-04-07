import { distinctUntilChanged, map, skipUntil, tap } from 'rxjs/operators'

import { setValueGetter } from '../lib/object/valueGetter'
import { simpleUnsub } from '../lib/rx/simpleUnsub'
import { countSubscriptions } from '../lib/rx/operator/countSubscriptions'
import { noop } from '../lib/function/noop'
import { useState } from '../lib/var/useState'

import { getReducedProjectionValue } from './reducedProjection'

export const createStateFlow = (reducedProjection, event$, skipUntil$) => {
  const { getState, setState } = useState(reducedProjection)

  const getValue = () => getReducedProjectionValue(getState())

  const getNextState = (event) => getState().getNextState(event)
  const getNextValue = (event) =>
    getReducedProjectionValue(setState(getNextState(event)))

  const state$ = event$.pipe(
    map(getNextState),
    tap(setState),

    // while init is not finished (past events replaying), we expect projections to
    // get all events, but we don't want any new state emited (it's not new states, it's past state rebuilding)
    skipUntil(skipUntil$),

    map(getReducedProjectionValue),
    distinctUntilChanged(),
  )

  let connectionCount = 0
  const connectionState$ = state$.pipe(
    countSubscriptions((count) => (connectionCount = count)),
  )

  // We don't return directly subscription because user is not aware it's an observable under the hood
  // For user, the request is to connect a stateFlow, it should return a function to disconnect it
  state$.connect = !reducedProjection.stateless
    ? () => simpleUnsub(connectionState$.subscribe())
    : // for stateless reducedProjection, connect or disconnect is useless
      () => noop

  setValueGetter(state$, getValue)

  return {
    name: reducedProjection.name,
    internal: {
      getValue,
      getNextValue,
    },
    external: state$,
    stateless: reducedProjection.stateless,
    isConnected: () => connectionCount > 0,
  }
}
