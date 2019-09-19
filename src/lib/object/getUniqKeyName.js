export const getUniqKeyName = (obj, name) => {
  if (!name) {
    return getUniqKeyName(obj, 'unnamed')
  }

  if (name in obj) {
    const match = name.match(/^(.*)-(\d+)$/)
    const count = (match && parseInt(match[2], 10)) || 1
    const basename = match[1] || name
    return getUniqKeyName(obj, `${basename}-${count + 1}`)
  }

  return name
}
