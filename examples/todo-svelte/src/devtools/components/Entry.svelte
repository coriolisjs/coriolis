<script>
import { setContext } from 'svelte'

import { currentView as currentViewAggr } from '../aggrs/currentView'

export let dispatch
export let getSource
export let getValue
export let views

setContext('dispatch', dispatch)
setContext('getSource', getSource)
setContext('getValue', getValue)

let CurrentView
getSource(currentViewAggr, newview => { CurrentView = views[newview] })

</script>

{#if CurrentView}
  <svelte:component this={CurrentView}/>
{/if}
