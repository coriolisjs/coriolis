
export const createIndex = getNotYetIndexed => {
  const index = new Map()

  return key => {
    const indexed = index.get(key)

    if (indexed) {
      return indexed.value
    }

    const value = getNotYetIndexed(key)

    index.set(key, { value })

    return value
  }
}
