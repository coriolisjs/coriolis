import { createIndex } from "../lib/map/objectIndex.js";

import { createStateFlow as defaultCreateStateFlow } from "./stateFlow.js";

export const createStateFlowFactory = (
  event$,
  skipUntil$,
  createStateFlow = defaultCreateStateFlow,
) => {
  const getStateFlow = (...args) => factory.get(...args);

  const getStateFlowList = () =>
    factory
      .list()
      .filter(([[projection]]) => projection !== "snapshot")
      .map(([, stateFlow]) => stateFlow);

  const factory = createIndex(
    createStateFlow(event$, skipUntil$, getStateFlow, getStateFlowList),
  );

  return (...args) => factory.get(...args).state$;
};
