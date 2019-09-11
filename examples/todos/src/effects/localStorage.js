import { getLocalStorageJSON, appendLocalStorage } from '../libs/browser/localStorage'

export const localStorage = storageKey => ({ addSource, addLogger }) => {
  const removeSource = addSource(getLocalStorageJSON(storageKey, []))
  const removeLogger = addLogger(appendLocalStorage(storageKey))

  return () => {
    removeSource()
    removeLogger()
  }
}
