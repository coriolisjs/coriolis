import Entry, { setStoreAPI } from '../components/Entry.svelte'

export const createCoriolisSvelteApp = ({
  dispatch,
  withProjection,
  target,
  Root,
  props,
}) => {
  setStoreAPI({ dispatch, withProjection })

  return new Entry({
    target,
    props: {
      Root,
      props,
    },
  })
}
