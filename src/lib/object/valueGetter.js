export const setValueGetter = (obj, getter) => {
  // We define both getValue and value getter because, depending on context, one
  // can be more readable than the other.
  // getValue is suited when we need to pass a reference to the function, and
  // value getter is best when accessing directly the value
  obj.getValue = getter;

  Object.defineProperty(obj, "value", {
    configurable: false,
    enumerable: true,
    get: getter,
  });

  return obj;
};

export const withValueGetter = (func, getter = func) => {
  const hof = (...args) => func(...args);

  return setValueGetter(hof, getter);
};
