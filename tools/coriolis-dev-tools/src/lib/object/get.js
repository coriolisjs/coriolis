export const get = (obj = {}, ...keys) =>
  keys.length < 2 ? obj[keys[0]] : get(obj[keys[0]], ...keys.slice(1))
