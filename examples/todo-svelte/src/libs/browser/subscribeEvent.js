
export const subscribeEvent = (node, eventName, listener, capture = false) => {
  node.addEventListener(eventName, listener, capture)

  return () => {
    node.removeEventListener(eventName, listener, capture)
  }
}
