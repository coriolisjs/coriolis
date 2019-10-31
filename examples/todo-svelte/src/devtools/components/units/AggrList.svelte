<script>
  import { getContext } from 'svelte'

  import AggrListItem from './AggrListItem.svelte'

  import { aggrsIndex } from '../../aggrs/aggrsList.js'

  const getSource = getContext('getSource')

  let aggrsIndex$ = getSource(aggrsIndex)
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
{#each Object.entries($aggrsIndex$) as [key, aggrstate] (aggrstate.aggrId)}
  <AggrListItem {...aggrstate} />
{/each}
</ul>
