<script>
  import { withProjection, createDispatch } from '@coriolis/coriolis-svelte'

  import { selectedTimingType } from '../../projections/selectedTimingType'
  import { timingTypeSelected, selectedEventListItem } from '../../events'

  export let item
  export let selected

  const selectedTimingType$ = withProjection(selectedTimingType)

  const selectTimingType = createDispatch(event => timingTypeSelected(event.target.value))

  const selectEventListItem = createDispatch(() => selectedEventListItem(item))
</script>

<style lang="scss">
  .eventListItem {
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: .5em;
    cursor: default;
    background: rgba(black, .1);
    line-height: 1.5em;

    &:hover {
      background: rgba(white, .1);
    }

    &.isEven {
      background: rgba(black, .2);
    }

    &.isPastEvent {
      opacity: .4;

      &:hover {
        opacity: 1;
      }
    }

    &.isError {
      color: #f66578;
    }

    &.isConnection {
      background: #3f4271;
      padding: .1em .5em 0;

      &.isSelected {
        background-color: rgba(24, 37, 196, 0.6);
      }
    }

    &.isSelected {
      opacity: 1;
      background-color: #99845e;
    }

    .type {
      flex: 1 1 auto;
    }

    .timing {
      position: relative;
      flex: 0 0 auto;
      text-align: right;

      .timing-select {
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        display: block;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        border: 1px dotted rgba(lime, .4);
        cursor: pointer;
        color: rgba(lime, .6);

        option {
          width: 0;
        }
      }
    }
  }
</style>

<div
  class="eventListItem"
  class:isEven={!(item.rank % 2)}
  class:isPastEvent={item.isPastEvent}
  class:isError={item.error}
  class:isConnection={item.type && item.type.includes('Init projection')}
  class:isSelected={selected}
  on:click={selectEventListItem}
>
  <div class="type">
    {item.type}
  </div>
  <div
    class="timing"
    on:click|stopPropagation
  >
    <select
      class="timing-select"
      on:change={selectTimingType}
    >
      <option value="deltaN" selected={$selectedTimingType$ === 'deltaN'}>+{item.deltaN}ms</option>
      <option value="delta0" selected={$selectedTimingType$ === 'delta0'}>+{item.delta0}ms</option>
      <option value="date" selected={$selectedTimingType$ === 'date'}>{item.date}</option>
      <option value="timestamp" selected={$selectedTimingType$ === 'timestamp'}>{item.timestamp}</option>
    </select>
  </div>
</div>
