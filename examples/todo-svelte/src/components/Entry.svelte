<script context="module">
  import { withProjection, createStoreAPIProvider } from '@coriolis/coriolis-svelte'

  const {
    setStoreAPI,
    shareStoreAPI
  } = createStoreAPIProvider()

  export { setStoreAPI }
</script>
<script>
  import { setContext } from 'svelte'

  import { currentView } from '../projections/currentView'

  shareStoreAPI()

  export let views

  const viewName$ = withProjection(currentView)

  let CurrentView
  $: CurrentView = views[$viewName$]
</script>

{#if CurrentView}
  <svelte:component this={CurrentView}/>
{:else}
  <div>... Routing Error ...</div>
{/if}
