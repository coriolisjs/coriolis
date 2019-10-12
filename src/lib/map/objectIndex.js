
export const createIndex = getNotYetIndexed => {
  let index = new Map()

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
    [...index]
      .map(([key, { value }]) => [key, value])

  const flush = key => {
    index = new Map(
      [...index]
        .filter(([itemKey]) => itemKey !== key)
    )
  }

  return {
    get,
    list,
    flush
  }
}
