
export const flatten = arr => Array.isArray(arr)
  ? arr.reduce((acc, value) => acc.concat(flatten(value)), [])
  : arr
