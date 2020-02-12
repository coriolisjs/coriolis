const noop = () => {}

export const chain = (...funcs) =>
  funcs.reduce(
    (acc, func) => (...args) => {
      func(...args)
      acc(...args)
    },
    noop,
  )
