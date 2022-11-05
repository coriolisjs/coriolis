import { useState } from "../lib/var/useState.js";

import { getReducedStateValue } from "./reducedState.js";

export const createReducedStateChain = (initialReducedState) => {
  const { getState, setState } = useState(initialReducedState);

  const getValue = () => getReducedStateValue(getState());

  const getNextState = (event) => getState().getNextState(event);
  const getNextValue = (event) =>
    getReducedStateValue(setState(getNextState(event)));

  return {
    initialReducedState,
    getValue,
    getNextValue,
    getNextState,
    setState,
  };
};
