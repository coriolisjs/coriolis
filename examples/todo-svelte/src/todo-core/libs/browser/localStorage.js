export const getLocalStorageJSON = (key, defaultValue = {}) => {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || defaultValue
  } catch (error) {
    return defaultValue
  }
}

export const setLocalStorageJSON = (key, value) =>
  window.localStorage.setItem(key, JSON.stringify(value))

export const localStoredArray = (key) => {
  let stored

  const init = () => {
    stored = [].concat(getLocalStorageJSON(key, []))
  }
  const simplyGet = () => stored

  let initOrGet = () => {
    init()
    initOrGet = simplyGet
    return simplyGet()
  }

  const get = () => initOrGet()

  const append = (value) => {
    if (!stored) {
      initOrGet()
    }

    stored = stored.concat(value)

    setLocalStorageJSON(key, stored)
  }

  return {
    get,
    append,
  }
}
