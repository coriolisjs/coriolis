<script>
  import { getSource } from '@coriolis/coriolis-svelte'

  import { projectionsList } from '../../projections/projectionsList.js'

  import ProjectionListItem from './ProjectionListItem.svelte'

  const projectionsList$ = getSource(projectionsList)
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
{#each $projectionsList$ as projectionState (projectionState.projectionId)}
  <ProjectionListItem {...projectionState} />
{/each}
</ul>
