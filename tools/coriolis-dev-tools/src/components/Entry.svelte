<script context="module">
  import { getSource, createStoreAPIRegisterer } from '../lib/svelte/coriolis'

  const {
    setStoreAPI,
    shareStoreAPI
  } = createStoreAPIRegisterer()

  export { setStoreAPI }
</script>
<script>
  import * as componentIndex from './views/componentIndex'
  import DevToolsButton from './units/DevToolsButton.svelte'

  import { enabledViewName } from '../aggrs/enabledViewName'

  shareStoreAPI()

  const CurrentView$ = getSource(enabledViewName)
</script>

{#if $CurrentView$}
  <svelte:component this={componentIndex[$CurrentView$]} />
{:else}
  <DevToolsButton />
{/if}
