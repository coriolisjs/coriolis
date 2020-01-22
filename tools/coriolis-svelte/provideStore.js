import { getContext, setContext } from 'svelte'

const KEY_GET_SOURCE = 'Coriolis store reference withProjection'
const KEY_DISPATCH = 'Coriolis store reference dispatch'

export const getSource = (...args) => getContext(KEY_GET_SOURCE)(...args)

export const createDispatch = builder => {
  const dispatch = getContext(KEY_DISPATCH)
  return (...args) => {
    const event = builder(...args)
    if (!event) {
      return
    }
    dispatch(event)
  }
}

export const createStoreAPIProvider = () => {
  let receivedStoreAPI
  const setStoreAPI = storeAPI => { receivedStoreAPI = storeAPI }

  const shareStoreAPI = () => {
    if (!receivedStoreAPI) {
      throw new Error('Store API to share has not been set')
    }

    const { eventSubject, withProjection } = receivedStoreAPI

    setContext(KEY_GET_SOURCE, withProjection)
    setContext(KEY_DISPATCH, event => eventSubject.next(event))
  }

  return {
    setStoreAPI,
    shareStoreAPI
  }
}
