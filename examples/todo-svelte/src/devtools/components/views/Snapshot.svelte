<script>
  import { getContext } from 'svelte'

  import DevToolsContainer from '../units/DevToolsContainer.svelte'

  const snapshot$ = getContext('snapshot$')
</script>

<DevToolsContainer>
  <h2 slot="title">Snapshot</h2>
  <pre>{JSON.stringify($snapshot$, null, 2)}</pre>
</DevToolsContainer>
