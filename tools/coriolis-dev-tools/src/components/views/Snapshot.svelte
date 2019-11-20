<script>
  import formatHighlight from 'json-format-highlight'

  import { getSource } from 'coriolis-svelte'

  import { currentStoreSnapshot } from '../../aggrs/currentStoreSnapshot'

  import DevToolsContainer from '../units/DevToolsContainer.svelte'

  const snapshot$$ = getSource(currentStoreSnapshot)
  let snapshot$ = snapshot$$.value
  $: snapshot$ = $snapshot$$
</script>

<style>
  pre {
    height: 100%;
    overflow: auto;
    background: rgba(0, 0, 0, .4);
    padding: 15px;
  }
</style>

<DevToolsContainer>
  <h2 slot="title">Snapshot</h2>
  <pre>
    {@html formatHighlight($snapshot$, {
      keyColor: 'rgb(138, 204, 114)',
      stringColor: 'rgb(235, 235, 227)'
    })}
  </pre>
</DevToolsContainer>
