const anyThrottle = (callback, requestor) => {
  let nextArgs
  let requesting

  const unqueue = () => {
    requesting = false
  }

  const behave = () => {
    callback(...nextArgs)
  }

  return (...args) => {
    nextArgs = args

    if (!requesting) {
      requesting = true
      requestor(behave, unqueue)
    }
  }
}

export const rafThrottle = callback =>
  anyThrottle(callback, (behave, unqueue) =>
    requestAnimationFrame(() => {
      unqueue()
      behave()
    }),
  )
