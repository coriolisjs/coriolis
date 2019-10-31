<script>
  import { getContext } from 'svelte'

  import AggrListItem from './AggrListItem.svelte'

  import { aggrsList } from '../../aggrs/aggrsList.js'

  const getSource = getContext('getSource')

  let aggrsList$ = getSource(aggrsList)
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
{#each Object.entries($aggrsList$) as aggrstate (aggrstate.aggrId)}
  <AggrListItem {...aggrstate} />
{/each}
</ul>
