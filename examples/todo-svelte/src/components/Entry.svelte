<script>
  import { setContext } from 'svelte'

  import { currentView } from '../projections/currentView'

  export let dispatch
  export let getSource
  export let views

  setContext('dispatch', dispatch)
  setContext('getSource', getSource)

  const viewName$ = getSource(currentView)

  let CurrentView
  $: CurrentView = views[$viewName$]
</script>

{#if CurrentView}
  <svelte:component this={CurrentView}/>
{:else}
  <div>... Routing Error ...</div>
{/if}
