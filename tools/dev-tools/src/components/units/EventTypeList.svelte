<script>
  import { withProjection } from '@coriolis/coriolis-svelte'

  import { eventTypeList } from '../../projections/eventTypeList'

  import EventTypeListItem from './EventTypeListItem.svelte'

  const eventTypeList$ = withProjection(eventTypeList)
</script>

<style lang="scss">
  .event-type-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>

<ul class="event-type-list">
{#each $eventTypeList$ as eventType (eventType.name)}
  <EventTypeListItem {...eventType} />
{/each}
</ul>
