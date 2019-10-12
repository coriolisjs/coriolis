<script>
  import { getContext } from 'svelte'

  import DevToolsContainer from '../units/DevToolsContainer.svelte'

  const snapshot$ = getContext('snapshot$')
</script>

<style>
  pre {
    height: 100%;
    overflow: auto;
  }
</style>

<DevToolsContainer>
  <h2 slot="title">Snapshot</h2>
  <pre>{JSON.stringify($snapshot$, null, 2)}</pre>
</DevToolsContainer>
