export const withInitialDefault = (func, defaultValue) => {
  let gotOutput = false
  return (...args) => {
    const output = func(...args)
    const outputDefined = output !== undefined

    if (!gotOutput && !outputDefined) {
      return defaultValue
    }

    gotOutput = gotOutput || outputDefined
    return output
  }
}
