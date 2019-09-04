
export const createIndex = getNotYetIndexed => {
  const index = []

  const getIndexed = key => {
    const indexed = index.find(item => item.key === key)

    if (indexed) {
      return indexed.value
    }

    const value = getNotYetIndexed(key, getIndexed)

    index.push({ key, value })

    return value
  }

  return getIndexed
}
