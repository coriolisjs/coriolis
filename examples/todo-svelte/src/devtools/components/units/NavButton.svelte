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

  const navAction = () => dispatch(buildEvent(view))
</script>

<button
  class="nav-button {$$props.class || ''}"
  on:click={navAction}
  disabled={$viewName$ === view}
>
  <slot />
</button>
