<script>
  import { getSource } from '../../lib/svelte/coriolis'

  import { aggrsList } from '../../aggrs/aggrsList.js'

  import AggrListItem from './AggrListItem.svelte'

  const aggrsList$ = getSource(aggrsList)
</script>

<style lang="scss">
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: auto;
  }
</style>

<ul>
{#each $aggrsList$ as aggrstate (aggrstate.aggrId)}
  <AggrListItem {...aggrstate} />
{/each}
</ul>
