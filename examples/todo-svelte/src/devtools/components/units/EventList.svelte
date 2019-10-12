<script>
  import { getContext } from 'svelte'

  import VirtualList from '@sveltejs/svelte-virtual-list';

  import EventListItem from './EventListItem.svelte'

  import { eventList } from '../../aggrs/eventList'

  const getSource = getContext('getSource')

  let eventList$ = getSource(eventList)
</script>

<style lang="scss">
  .eventList {
    height: 100%;
    overflow: hidden;

    :global(svelte-virtual-list-row):hover {
      background: rgba(white, .1);
    }

    :global(svelte-virtual-list-row):nth-child(even) {
      background: rgba(black, .1);
    }
  }
</style>

<div class="eventList">
  <VirtualList items={$eventList$} let:item>
    <EventListItem {...item} />
  </VirtualList>
</div>
