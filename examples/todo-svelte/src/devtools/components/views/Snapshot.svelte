<script>
  import { getContext } from 'svelte'

  import { snapshot } from 'coriolis'

  import DevToolsContainer from '../units/DevToolsContainer.svelte'

  const getSource = getContext('getSource')

  const snapshot$ = getSource(snapshot)
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
