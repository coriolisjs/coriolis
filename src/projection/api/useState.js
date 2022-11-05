export const sourceState = {};

export const useState = (settings) => (initialValue) => {
  if (settings.stateIndex !== undefined) {
    throw new Error(
      "useState should be used only once in an projection definition setup",
    );
  }
  settings.initialState = initialValue;
  settings.stateIndex = settings.sources.length;
  settings.sources.push(sourceState);
};
