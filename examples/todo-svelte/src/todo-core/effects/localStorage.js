import { localStoredArray } from '../libs/browser/localStorage'

export const localStorage = (storageKey) => {
  const storage = localStoredArray(storageKey)

  return ({ addSource, addLogger }) => {
    const removeSource = addSource(storage.get())
    const removeLogger = addLogger(storage.append)

    return () => {
      removeSource()
      removeLogger()
    }
  }
}
