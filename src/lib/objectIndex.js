
export const createIndex = getNotYetIndexed => {
  const index = []

  return key => {
    const indexed = index.find(item => item.key === key)

    if (indexed) {
      return indexed.value
    }

    const value = getNotYetIndexed(key)

    index.push({ key, value })

    return value
  }
}
