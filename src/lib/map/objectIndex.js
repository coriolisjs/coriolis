const createSubsetGetter =
  (index, getNotYetIndexed) => (indexed, key, rest) => {
    let subset = indexed.subset

    if (!subset) {
      subset = createIndex((...args) => getNotYetIndexed(key, ...args))

      index.set(key, {
        ...indexed,
        subset,
      })
    }

    return subset.get(...rest)
  }

const createValueGetter =
  (
    index,
    getNotYetIndexed,
    getSubset = createSubsetGetter(index, getNotYetIndexed),
  ) =>
  (key, ...rest) => {
    const indexed = index.get(key) || {}

    if (rest.length) {
      return getSubset(indexed, key, rest)
    }

    if (indexed.loading) {
      throw new Error('Cycle index referencing is not possible')
    }

    if ('value' in indexed) {
      return indexed.value
    }

    indexed.loading = true

    const value = getNotYetIndexed(key)

    index.set(key, {
      ...indexed,
      value,
      loading: false,
    })

    return value
  }

export const createIndex = (getNotYetIndexed) => {
  let index = new Map()

  const get = createValueGetter(index, getNotYetIndexed)

  const list = () =>
    [...index].reduce(
      (list, [key, { subset, value }]) => [
        ...list,
        ...(value ? [[[key], value]] : []),
        ...(subset
          ? subset
              .list()
              .map(([subkey, value]) => [[].concat(key, subkey), value])
          : []),
      ],
      [],
    )

  const flush = (key, ...rest) => {
    if (rest.length) {
      const indexed = index.get(key)
      if (indexed && indexed.subset) {
        indexed.subset.flush(...rest)
      }
      return
    }

    index = new Map([...index].filter(([itemKey]) => itemKey !== key))
  }

  return {
    get,
    list,
    flush,
  }
}
