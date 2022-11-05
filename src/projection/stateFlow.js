import { distinctUntilChanged, map, skipUntil, tap } from "rxjs/operators";

import { noop } from "../lib/function/noop.js";
import { setValueGetter } from "../lib/object/valueGetter.js";
import { simpleUnsub } from "../lib/rx/simpleUnsub.js";
import { countSubscriptions } from "../lib/rx/operator/countSubscriptions.js";

import { compileProjection } from "./compile.js";
import { createReducedState, getReducedStateValue } from "./reducedState.js";
import { createReducedStateChain } from "./reducedStateChain.js";
import { createSnapshotReducer } from "./snapshotReducer.js";

export const createStateFlow =
  (event$, skipUntil$, getStateFlow, getStateFlowList) => (...args) => {
    // Three possible formats for args :
    //     (projection)
    //     ('reducer', reducer, initialState)
    //     ('snapshot')
    let reducer;
    let initialState;

    // one specific case if given projection is the snapshot projection
    if (args[0] === "snapshot") {
      reducer = createSnapshotReducer(getStateFlowList);
    } else if (args[0] === "reducer") {
      [, reducer, initialState] = args;
    } else {
      const [projection] = args;
      ({ reducer, initialState } = compileProjection(projection, getStateFlow));
    }

    const { getValue, getNextValue, getNextState, setState } =
      createReducedStateChain(createReducedState(reducer, initialState));

    const state$ = event$.pipe(
      map(getNextState),
      tap(setState),
      // while init (past events replaying) is not finished, we expect projections to
      // get all events, but we don't want any new state emited (it's not new states, it's past state rebuilding)
      skipUntil(skipUntil$),
      map(getReducedStateValue),
      distinctUntilChanged(),
      // One could think a shareReplay operator should be added here. But it is not the case.
      // In case of multiple subscriptions, each event will go through every operator up there as much times as there is subscriptions.
      // But this is not a big deal because the getNextState will return without extra computing if called multiple times with the same event
      // and all other operators are just very simple operations.
    );

    let connectionCount = 0;
    const connectionState$ = state$.pipe(
      countSubscriptions((count) => (connectionCount = count)),
    );

    // We don't return directly subscription because user is not aware it's an observable under the hood
    // For user, the request is to connect a stateFlow, it should return a function to disconnect it
    state$.connect = !reducer.stateless
      ? () => simpleUnsub(connectionState$.subscribe())
      // for stateless reducedState, connect or disconnect is useless
      : () => noop;

    setValueGetter(state$, getValue);

    return {
      name: reducer.name,
      getValue,
      getNextValue,
      state$,
      stateless: !!reducer.stateless,
      isConnected: () => connectionCount > 0,
    };
  };
