export const useState = (initialState) => {
  let state = initialState;

  return {
    getState: () => state,
    setState: (newState) => (state = newState),
  };
};
