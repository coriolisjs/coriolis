// eslint-disable-next-line import/no-unresolved
import { getContext, setContext } from 'svelte'

const KEY_STORE_API = 'Coriolis store reference'

export const withProjection = (...args) =>
  getContext(KEY_STORE_API).withProjection(...args)

export const getDispatch = () => getContext(KEY_STORE_API).dispatch

export const createDispatch = (builder) => {
  const dispatch = getDispatch()
  return (...args) => dispatch(builder(...args))
}

export const setStoreAPI = (storeAPI) => {
  setContext(KEY_STORE_API, storeAPI)
}
