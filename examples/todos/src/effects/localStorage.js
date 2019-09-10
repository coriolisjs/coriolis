import { getLocalStorageJSON, appendLocalStorage } from '../libs/browser/localStorage'

export const localStorage = storageKey => ({ pipeSource, pipeLogger }) =>
  pipeSource(getLocalStorageJSON(storageKey, []))
    .add(pipeLogger(appendLocalStorage(storageKey)))
