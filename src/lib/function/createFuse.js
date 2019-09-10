const noop = () => {}

export const createFuse = (func, cutFunc = noop) => {
  let fusable = (...args) => func(...args)
  return ({
    pass: (...args) => fusable(...args),
    cut: () => { fusable = cutFunc }
  })
}
