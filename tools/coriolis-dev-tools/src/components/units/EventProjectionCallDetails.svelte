<script>
  import formatHighlight from 'json-format-highlight'

  export let projectionCall

  let isUnfolded = false

  const toggleFold = () => {
    isUnfolded = !isUnfolded
  }
</script>

<style lang="scss">
  h3 {
    cursor: pointer;
    margin: 5px 0 0;
    padding: 0 1em;
  }

  li {
    position: relative;
    background: rgba(black, .2);
  }

  li:nth-child(even) {
    background: rgba(black, .1);
  }

  li::before {
    content: '+';
    position: absolute;
    top: 0;
    left: 0;
    padding: 3px 0 0 4px;
    pointer-events: none;
    user-select: none;
  }

  li.isUnfolded::before {
    content: '-';
  }

  .before, .after {
    margin-left: 10px;
    background: rgb(94, 92, 92);
    padding: 10px;

    pre {
      margin: 0;
    }
  }
</style>

<li class:isUnfolded>
  <h3
    on:click={toggleFold}
  >{projectionCall.name}</h3>
  {#if isUnfolded}
  <div class="before">
    before:
    <pre>
      {@html formatHighlight(projectionCall.previousState, {
        keyColor: 'rgb(138, 204, 114)',
        stringColor: 'rgb(235, 235, 227)'
      })}
    </pre>
  </div>
  <div class="after">
    after:
    <pre>
      {@html formatHighlight(projectionCall.newState, {
        keyColor: 'rgb(138, 204, 114)',
        stringColor: 'rgb(235, 235, 227)'
      })}
    </pre>
  </div>
  {/if}
</li>
