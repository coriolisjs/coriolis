import { localStoredArray } from '../libs/browser/localStorage'

export const createLocalStorageEffect = (storageKey) => {
  const storage = localStoredArray(storageKey)

  return function localStorage({ addSource, addLogger }) {
    const removeSource = addSource(storage.get())
    const removeLogger = addLogger((event) => {
      // removes useless fromCommand prop from event before storage
      const { fromCommand, ...meta } = event.meta
      storage.append({
        ...event,
        meta,
      })
    })

    return () => {
      removeSource()
      removeLogger()
    }
  }
}
