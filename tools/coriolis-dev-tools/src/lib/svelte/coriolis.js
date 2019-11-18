import { getContext, setContext } from 'svelte'

export const getSource = (...args) => getContext('getSource')(...args)

export const createDispatch = builder => {
  const dispatch =  getContext('dispatch')
  return (...args) => dispatch(builder(...args))
}

export const createStoreAPIRegisterer = () => {
  let receivedStoreAPI
  const setStoreAPI = storeAPI => { receivedStoreAPI = storeAPI }

  const shareStoreAPI = () => {
    if (!receivedStoreAPI) {
      throw new Error('Store API to share has not been set')
    }

    const { eventSubject, withAggr } = receivedStoreAPI

    setContext('getSource', withAggr)
    setContext('dispatch', event => eventSubject.next(event))
  }

  return {
    setStoreAPI,
    shareStoreAPI
  }
}
