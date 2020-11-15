<script context="module">
  import { createStoreAPIProvider } from '@coriolis/coriolis-svelte'

  const {
    setStoreAPI,
    shareStoreAPI,
    whenStoreAPIShared,
  } = createStoreAPIProvider()

  export { setStoreAPI }
</script>
<script>
  export let Root
  export let props

  shareStoreAPI()
</script>

{#await whenStoreAPIShared then ready}
  <svelte:component this={Root} {...props} />
{/await}
