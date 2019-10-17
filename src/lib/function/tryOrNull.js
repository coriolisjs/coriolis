export const tryOrNull = behaviour => {
  try {
    return behaviour()
  } catch (error) {
    return null
  }
}
