import { getContext } from 'svelte'

export const getSource = (...args) => getContext('getSource')(...args)

export const createDispatch = builder => {
  const dispatch =  getContext('dispatch')
  return (...args) => dispatch(builder(...args))
}
