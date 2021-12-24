<script>
  import { createDispatch } from '@coriolis/coriolis-svelte'

  import { changeView } from '../../todo-core/commands/changeView'

  const dispatchChange = createDispatch(changeView)

  export let view

  const trigger = () => dispatchChange(view)
</script>

<a href={view} on:click|preventDefault={trigger}><slot /></a>
