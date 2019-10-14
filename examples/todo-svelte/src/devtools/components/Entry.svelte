<script>
  import { setContext } from 'svelte'

  import DevToolsButton from './units/DevToolsButton.svelte'

  import { currentView } from '../aggrs/currentView'
  import { isDevtoolsOpen } from '../aggrs/isDevtoolsOpen'

  export let dispatch
  export let getSource
  export let views

  const viewsIndex = views.reduce((idx, view) => ({
    ...idx,
    [view.name]: view
  }), {})

  setContext('dispatch', dispatch)
  setContext('getSource', getSource)
  setContext('views', views)

  const viewName$ = getSource(currentView)
  const isDevtoolsOpen$ = getSource(isDevtoolsOpen)

  let CurrentView
  $: CurrentView = $isDevtoolsOpen$ && viewsIndex[$viewName$] && viewsIndex[$viewName$].component
</script>

{#if CurrentView}
  <svelte:component this={CurrentView}/>
{:else}
  <DevToolsButton />
{/if}
