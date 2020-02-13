<script>
  export let projection
  export let projectionBehavior = undefined
  export let projectionId
  export let name
  export let setupCalls = 0
  export let aggregatorCalls = 0
  export let cachedCalls = 0
  export let stateCalls = 0
  export let projectionCalls = 0
  export let isReducer = false
  export let aggregator
</script>

<style lang="scss">
  li {
    padding: .5em .5em .5em 1.5em;

    &:nth-child(even) {
      background: rgba(black, .2);
    }

    &:hover {
      background: rgba(white, .1);
    }

    h3 {
      padding: 0;
      margin: 0 0 0 -1em;
    }
  }
</style>

<li
  on:click={() => console.log(projection, projectionBehavior, aggregator)}
>
  <h3>{name} ({projectionId})</h3>
  <div class="projectionType"><span class="label">type:</span> {isReducer ? 'reducer' : 'custom'}</div>
  <div class="projectionSetupCalls"><span class="label">setup calls:</span> {setupCalls}</div>
  <div class="projectionCalls"><span class="label">executions:</span> {projectionCalls}</div>
  <div class="cachedCalls"><span class="label">cached calls:</span> {cachedCalls}</div>
  <div class="stateCalls"><span class="label">state calls:</span> {stateCalls}</div>
  <div class="totalCalls"><span class="label">total calls:</span> {aggregatorCalls}</div>
</li>
