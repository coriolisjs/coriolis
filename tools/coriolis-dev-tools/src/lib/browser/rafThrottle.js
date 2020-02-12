const anyThrottle = (behaviour, requestor) => {
  let nextArgs
  let requesting

  const unqueue = () => {
    requesting = false
  }

  const behave = () => {
    behaviour(...nextArgs)
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
