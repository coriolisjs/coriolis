export const subscribeEvent = (node, eventName, callback, phase = false) => {
  node.addEventListener(eventName, callback, phase)
  return () => node.removeEventListener(eventName, callback, phase)
}
