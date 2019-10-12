<script>
  import DevToolsContainer from '../units/DevToolsContainer.svelte'
</script>

<DevToolsContainer>
  <h2 slot="title">Liste des aggrégats</h2>

  <ul>
    <li>liste des aggregats</li>
    <li>Nombre d'appels pour chaque aggregat</li>
    <li>Nombre d'appels en cache pour chaque aggregat</li>
    <li>Nombre d'appels en sans cache pour chaque aggregat</li>
    <li>Au click, dump en console de l'aggregateur (reducer ou selecteur)</li>
  </ul>
</DevToolsContainer>
