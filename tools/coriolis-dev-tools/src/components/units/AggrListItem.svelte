<script>
  export let aggr
  export let aggrBehavior = undefined
  export let aggrId
  export let name
  export let setupCalls = 0
  export let aggregatorCalls = 0
  export let cachedCalls = 0
  export let stateCalls = 0
  export let aggrCalls = 0
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
  on:click={() => console.log(aggr, aggrBehavior, aggregator)}
>
  <h3>{name} ({aggrId})</h3>
  <div class="aggrType"><span class="label">type:</span> {isReducer ? 'reducer' : 'custom'}</div>
  <div class="aggrSetupCalls"><span class="label">setup calls:</span> {setupCalls}</div>
  <div class="aggrCalls"><span class="label">executions:</span> {aggrCalls}</div>
  <div class="cachedCalls"><span class="label">cached calls:</span> {cachedCalls}</div>
  <div class="stateCalls"><span class="label">state calls:</span> {stateCalls}</div>
  <div class="totalCalls"><span class="label">total calls:</span> {aggregatorCalls}</div>
</li>
