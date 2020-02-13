<script>
  import { createDispatch } from '@coriolis/coriolis-svelte'

  import { changed } from '../../events/view'

  const dispatchChanged = createDispatch(changed)

  export let view

  const trigger = () => dispatchChanged({ view })
</script>

<a href={view} on:click|preventDefault={trigger}><slot /></a>
