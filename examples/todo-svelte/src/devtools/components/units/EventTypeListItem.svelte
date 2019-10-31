<script>
  export let name
  export let count
</script>

<style lang="scss">
  li {
    padding: .5em;

    &:nth-child(even) {
      background: rgba(black, .2);
    }

    &:hover {
      background: rgba(white, .1);
    }

    .count {
      float: right;
      margin-right: 30px;
    }
  }
</style>

<li>
  {name}
  <span class="count">{count}</span>
</li>
