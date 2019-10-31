<script>
  import { getSource, createDispatch } from '../../lib/svelte/coriolis'

  import { currentViewName } from '../../aggrs/currentViewName'
  import { viewChanged } from '../../events'

  export let view
  export let aggr = currentViewName
  export let buildEvent = viewChanged

  const viewName$ = getSource(aggr)

  const navAction = createDispatch(() => buildEvent(view))
</script>

<button
  class="nav-button {$$props.class || ''}"
  on:click={navAction}
  disabled={$viewName$ === view}
>
  <slot />
</button>
