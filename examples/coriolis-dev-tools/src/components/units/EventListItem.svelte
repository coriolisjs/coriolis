<script>
  import { getContext } from 'svelte'

  import { selectedTimingType } from '../../aggrs/selectedTimingType'
  import { devtoolsTimingTypeSelected } from '../../events'

  export let type
  export let payload
  export let meta
  export let error
  export let isInitialEvent

  export let timestamp
  export let date
  export let deltaN
  export let delta0

  const getSource = getContext('getSource')
  const dispatch = getContext('dispatch')

  const selectedTimingType$ = getSource(selectedTimingType)

  const selectTimingType = event => dispatch(devtoolsTimingTypeSelected(event.target.value))

  const logEvent = () => console.log(`${error ? 'ERROR - ' : ''}${type}\npayload: `, payload, '\nmeta: ', meta)
</script>

<style lang="scss">
  .eventListItem {
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: .5em;
    cursor: default;

    &.isInitialEvent {
      opacity: .4;

      &:hover {
        opacity: 1;
      }
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
  class:isInitialEvent
  on:click={logEvent}
>
  <div class="type">
    {type}
  </div>
  <div
    class="timing"
    on:click|stopPropagation
  >
    <select
      class="timing-select"
      on:change={selectTimingType}
    >
      <option value="deltaN" selected={$selectedTimingType$ === 'deltaN'}>+{deltaN}ms</option>
      <option value="delta0" selected={$selectedTimingType$ === 'delta0'}>+{delta0}ms</option>
      <option value="date" selected={$selectedTimingType$ === 'date'}>{date}</option>
      <option value="timestamp" selected={$selectedTimingType$ === 'timestamp'}>{timestamp}</option>
    </select>
  </div>
</div>
