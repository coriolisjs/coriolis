export const withSimpleStoreSignature = (callback) => (_options, ...rest) => {
  let options = _options || {}
  let effects
  if (typeof options === 'function') {
    effects = [options, ...rest]
    options = {}
  } else if (options.effects && Array.isArray(options.effects)) {
    effects = [...options.effects, ...rest]
  } else {
    effects = rest
  }

  return callback(options, ...effects)
}
