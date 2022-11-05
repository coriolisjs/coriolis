import { isError, protectExecution } from "../lib/function/protectExecution.js";
import { createProjectionSetupAPI } from "./api/index.js";

export const compileProjection = (projection, getStateFlow) => {
  if (typeof projection !== "function") {
    throw new TypeError("Projection must be a function");
  }

  const { setupAPI, preventOutOfScopeUsage, getPostTreatmentData } =
    createProjectionSetupAPI();

  const executionResult = protectExecution(projection)(setupAPI);

  if (isError(executionResult)) {
    executionResult.error.message =
      `Projection setup error: ${executionResult.error.message}`;
    throw executionResult.error;
  }

  const projectionBehavior = executionResult.result;

  preventOutOfScopeUsage();

  const { name, initialState, getInputs, stateless, finalProjectionBehavior } =
    getPostTreatmentData(projection.name, projectionBehavior, getStateFlow);

  const reducer = (lastState, event) => {
    const inputs = getInputs(lastState, event);

    if (!inputs) {
      return lastState;
    }

    return finalProjectionBehavior(...inputs);
  };

  Object.defineProperty(reducer, "name", {
    value: name,
    writable: false,
  });

  Object.defineProperty(reducer, "stateless", {
    value: stateless,
    writable: false,
  });

  return {
    initialState,
    reducer,
  };
};
