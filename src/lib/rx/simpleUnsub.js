const noop = () => {}

export const simpleUnsub = subscription => () =>
  (subscription && subscription.unsubscribe)
    ? subscription.unsubscribe()
    : (subscription || noop)
