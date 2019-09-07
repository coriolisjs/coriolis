
export const findreplace = (arr, search, mapper) => {
  const idx = arr.findIndex(search)

  if (idx === -1) {
    return arr
  }

  return [
    ...arr.slice(0, idx),
    mapper(arr[idx]),
    ...arr.slice(idx + 1)
  ]
}
