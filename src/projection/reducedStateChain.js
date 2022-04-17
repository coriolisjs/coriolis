import { useState } from '../lib/var/useState'

import { getReducedStateValue } from './reducedState'

export const createReducedStateChain = (initialReducedState) => {
  const { getState, setState } = useState(initialReducedState)

  const getValue = () => getReducedStateValue(getState())

  const getNextState = (event) => getState().getNextState(event)
  const getNextValue = (event) =>
    getReducedStateValue(setState(getNextState(event)))

  return {
    initialReducedState,
    getValue,
    getNextValue,
    getNextState,
    setState,
  }
}
