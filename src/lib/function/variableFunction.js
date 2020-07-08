import { noop } from './noop'

export const variableFunction = (initialBehaviour = noop) => {
  let behaviour = initialBehaviour

  const setup = (func) => {
    behaviour = func
  }

  return {
    func: (...args) => behaviour(...args),
    setup,
  }
}
