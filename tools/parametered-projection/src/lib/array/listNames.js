const toString = obj => obj && obj.toString()
const quoted = value => `"${value}"`

export const listNames = list =>
  list
    .map(toString)
    .map(quoted)
    .join(', ')
