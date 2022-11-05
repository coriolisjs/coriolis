export const isError = (executionResult) => "error" in executionResult;
export const isSuccess = (executionResult) => "result" in executionResult;

export const protectExecution = (executable) => (...args) => {
  try {
    return {
      result: executable(...args),
    };
  } catch (error) {
    return {
      error,
    };
  }
};
