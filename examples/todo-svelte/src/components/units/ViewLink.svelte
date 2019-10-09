<script>
  import { getContext } from 'svelte'

  import { changed } from '../../events/view'

  const dispatch = getContext('dispatch')

  export let view

  const trigger = () => dispatch(changed({ view }))
</script>

<a href={view} on:click|preventDefault={trigger}><slot /></a>
