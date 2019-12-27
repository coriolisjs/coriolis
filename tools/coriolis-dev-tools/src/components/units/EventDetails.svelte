<script>
  import formatHighlight from 'json-format-highlight'

  import { createDispatch } from 'coriolis-svelte'

  import EventAggrCallDetails from './EventAggrCallDetails.svelte'

  import { selectedEventListItem } from '../../events'

  export let details

  $: console.log(details)
  const close = createDispatch(() => selectedEventListItem(undefined))
</script>

<style lang="scss">
  .event-details {
    display: flex;
    flex-direction: column;
    position: relative;
    border-top: 2px solid silver;

    .type {
      flex: 0;
      margin: 0;
      background: gray;
      font-size: 1em;
      line-height: 2;
      padding: 0 1em;
    }

    .body {
      flex: 1;
      overflow: hidden;

      display: flex;
      flex-direction: row;

      .content {
        flex: 1;
        overflow: auto;

        padding: 10px;

        .error-warning {
          color: #f66578;
        }
      }

      .effects {
        flex: 1;
        overflow: auto;
        padding: 10px;

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
      }
    }

    .actions {
      .close {
        position: absolute;
        right: 0;
        top: 0;
        margin: 0;
        padding: 4px 13px;
        width: 35px;
        color: rgba(0, 0, 0, 0);
        cursor: pointer;

        &::before {
          content: 'X';
          color: black;
        }
      }
    }
  }
</style>

<div class="event-details" class:isPastEvent={details.isPastEvent}>
  <h2 class="type">
    {details.isPastEvent ? '(Past event) ' : ''}
    {details.type}
  </h2>
  <div class="body">
    <div class="content">
      {#if details.error}
        <p class="error-warning">This event is an error event</p>
      {/if}
      <pre>
        {@html formatHighlight((details.error && details.payload.message) || details.payload, {
          keyColor: 'rgb(138, 204, 114)',
          stringColor: 'rgb(235, 235, 227)'
        })}
      </pre>
      <pre>
        {@html formatHighlight(details.meta, {
          keyColor: 'rgb(138, 204, 114)',
          stringColor: 'rgb(235, 235, 227)'
        })}
      </pre>
    </div>
    <div class="effects">
      Number of aggr affected: {details.aggrCalls.length}
      <ul>
      {#each details.aggrCalls as aggrCall (aggrCall.name)}
        <EventAggrCallDetails {aggrCall} />
      {/each}
      </ul>
    </div>
  </div>
  <div class="actions">
    <button class="close" on:click={close}>close</button>
  </div>
</div>
