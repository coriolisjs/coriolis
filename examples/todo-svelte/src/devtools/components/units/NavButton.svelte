<script>
  import { getContext } from 'svelte'

  import { currentView } from '../../aggrs/currentView'
  import { viewChanged } from '../../events'

  const getSource = getContext('getSource')
  const dispatch = getContext('dispatch')

  export let view
  export let aggr = currentView
  export let buildEvent = viewChanged

  const viewName$ = getSource(aggr)

  const openDevTools = () => dispatch(buildEvent(view))
</script>

<button
  class="nav-button {$$props.class || ''}"
  on:click={openDevTools}
  disabled={$viewName$ === view}
>
  <slot />
</button>
