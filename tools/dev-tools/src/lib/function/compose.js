const identity = arg => arg

export const compose = (...funcs) =>
  funcs.reduce((acc, func) => arg => func(acc(arg)), identity)
