export const getLocalStorageJSON = (key, defaultValue = {}) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue
  } catch (error) {
    return defaultValue
  }
}

export const appendLocalStorage = key => value =>
  localStorage.setItem(key, JSON.stringify([].concat(getLocalStorageJSON(key, []), value)))
