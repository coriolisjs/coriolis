export const simpleUnsub = subscription => () =>
  subscription && subscription.unsubscribe
    ? subscription.unsubscribe()
    : subscription && subscription()
