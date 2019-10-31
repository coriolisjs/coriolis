<script>
  import { getContext } from 'svelte'

  import EventTypeListItem from './EventTypeListItem.svelte'

  import { eventTypeList } from '../../aggrs/eventTypeList'

  const getSource = getContext('getSource')

  let eventTypeList$ = getSource(eventTypeList)
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
