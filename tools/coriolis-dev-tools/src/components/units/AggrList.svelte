<script>
  import { getSource } from 'coriolis-svelte'

  import { aggrsList } from '../../aggrs/aggrsList.js'

  import AggrListItem from './AggrListItem.svelte'

  const aggrsList$ = getSource(aggrsList)
</script>

<style lang="scss">
  ul.content {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: auto;
  }
</style>

<ul class="content">
{#each $aggrsList$ as aggrstate (aggrstate.aggrId)}
  <AggrListItem {...aggrstate} />
{/each}
</ul>
