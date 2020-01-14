<script>
  import VirtualList from '@sveltejs/svelte-virtual-list';

  import { getSource } from '@coriolis/coriolis-svelte'

  import { filteredEventList } from '../../projections/filteredEventList'
  import { eventListSelectedEvent } from '../../projections/eventList'

  import EventListItem from './EventListItem.svelte'
  import EventDetails from './EventDetails.svelte'

  const eventList$ = getSource(filteredEventList)
  const eventListSelectedEvent$ = getSource(eventListSelectedEvent)
</script>

<style lang="scss">
  .eventList {
    position: relative;
    height: 100%;
    overflow: hidden;

    .empty {
      position: absolute;
      width: 100%;
      top: 45%;
      text-align: center;
    }
  }
</style>

<div class="eventList">
{#if ($eventList$ && $eventList$.length)}
  <VirtualList items={$eventList$} let:item>
    <EventListItem {item} selected={$eventListSelectedEvent$ === item} />
  </VirtualList>
{:else}
  <div class="empty">No event to display</div>
{/if}
</div>
{#if $eventListSelectedEvent$}
<EventDetails details={$eventListSelectedEvent$} />
{/if}
