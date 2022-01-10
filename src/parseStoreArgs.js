import { pipe } from './lib/function/pipe'

export const parseStoreArgs = (initialOptions, ...rest) => {
  let options = initialOptions || {}
  let effects
  if (typeof options === 'function') {
    effects = [options, ...rest]
    options = {}
  } else if (options.effects && Array.isArray(options.effects)) {
    effects = [...options.effects, ...rest]
  } else {
    effects = rest
  }

  return {
    ...options,
    effects,
  }
}

export const withSimpleStoreSignature = (callback) =>
  pipe(parseStoreArgs, callback)
