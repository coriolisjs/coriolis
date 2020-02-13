<script>
  import formatHighlight from 'json-format-highlight'

  import { withProjection } from '@coriolis/coriolis-svelte'

  import { currentStoreSnapshot } from '../../projections/currentStoreSnapshot'

  import DevToolsContainer from '../units/DevToolsContainer.svelte'

  const snapshot$$ = withProjection(currentStoreSnapshot)
  let snapshot$ = snapshot$$.value
  $: snapshot$ = $snapshot$$
</script>

<style>
  .content {
    height: 100%;
    background: rgba(0, 0, 0, .4);
    padding: 15px;
  }
</style>

<DevToolsContainer>
  <h2 slot="title">Snapshot</h2>
  <div class="content">
    <pre>
      {@html formatHighlight($snapshot$, {
        keyColor: 'rgb(138, 204, 114)',
        stringColor: 'rgb(235, 235, 227)'
      })}
    </pre>
  </div>
</DevToolsContainer>
