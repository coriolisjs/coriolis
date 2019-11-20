<script>
  import VirtualList from '@sveltejs/svelte-virtual-list';

  import { getSource } from 'coriolis-svelte'

  import { filteredEventList } from '../../aggrs/filteredEventList'

  import EventListItem from './EventListItem.svelte'

  const eventList$ = getSource(filteredEventList)
</script>

<style lang="scss">
  .eventList {
    position: relative;
    height: 100%;
    overflow: hidden;

    :global(svelte-virtual-list-row) {
      background: rgba(black, .1);

      &:nth-child(even) {
        background: rgba(black, .2);
      }
    }

    :global(svelte-virtual-list-row):hover {
      background: rgba(white, .1);
    }

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
    <EventListItem {...item} />
  </VirtualList>
{:else}
  <div class="empty">No event to display</div>
{/if}
</div>
