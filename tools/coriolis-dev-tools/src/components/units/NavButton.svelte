<script>
  import { getSource, createDispatch } from 'coriolis-svelte'

  import { currentViewName } from '../../projections/currentViewName'
  import { viewChanged } from '../../events'

  export let view
  export let projection = currentViewName
  export let buildEvent = viewChanged

  const viewName$ = getSource(projection)

  const navAction = createDispatch(() => buildEvent(view))
</script>

<button
  class="nav-button {$$props.class || ''}"
  on:click={navAction}
  disabled={$viewName$ === view}
>
  <slot />
</button>
