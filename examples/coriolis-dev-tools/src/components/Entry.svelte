<script>
  import { setContext } from 'svelte'

  import DevToolsButton from './units/DevToolsButton.svelte'

  import { enabledViewComponent } from '../aggrs/enabledViewComponent'

  export let dispatch
  export let getSource

  setContext('dispatch', dispatch)
  setContext('getSource', getSource)

  const CurrentView$ = getSource(enabledViewComponent)
</script>

{#if $CurrentView$}
  <svelte:component this={$CurrentView$} />
{:else}
  <DevToolsButton />
{/if}
