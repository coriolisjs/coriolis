<script>
  import { withProjection } from '@coriolis/coriolis-svelte'
  import { currentView } from '../todo-core/projections/currentView'

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
