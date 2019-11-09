<script>
  import { setContext } from 'svelte'

  import * as componentIndex from './views/componentIndex'
  import DevToolsButton from './units/DevToolsButton.svelte'

  import { enabledViewName } from '../aggrs/enabledViewName'

  export let dispatch
  export let getSource

  setContext('dispatch', dispatch)
  setContext('getSource', getSource)

  const CurrentView$ = getSource(enabledViewName)
</script>

{#if $CurrentView$}
  <svelte:component this={componentIndex[$CurrentView$]} />
{:else}
  <DevToolsButton />
{/if}
