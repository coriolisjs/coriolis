
export const createIndex = getNotYetIndexed => {
  const index = new Map()

  const get = key => {
    const indexed = index.get(key)

    if (indexed) {
      return indexed.value
    }

    const value = getNotYetIndexed(key)

    index.set(key, { value })

    return value
  }

  const list = () =>
    Array.from(index.entries())
      .map(([key, { value }]) => [key, value])

  return {
    get,
    list
  }
}
