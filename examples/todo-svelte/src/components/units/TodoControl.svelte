<script>
  import { withProjection, createDispatch } from '@coriolis/coriolis-svelte'

  import { added, filter, filters } from '../../events/todo'
  import { todolistFilterName } from '../../projections/todo'

  const dispatchAdded = createDispatch(added)
  const dispatchFilter = createDispatch(filter)

  let filterName$ = withProjection(todolistFilterName)
  let textInput
  let textInputValue

  const addItem = () => {
    if (!textInputValue) {
      return
    }

    dispatchAdded({ text: textInputValue })
    textInputValue = ''
    textInput.focus()
  }

  const setFilter = filterName => {
    dispatchFilter({ filterName })
  }

  const focus = el => el.focus()
</script>

<style lang="scss">
  button[disabled] {
    color: silver;
    opacity: .5
  }

  button.filter {
    cursor: pointer;

    &[disabled] {
      background: rgb(95, 197, 95);
      cursor: default;
      color: black;
    }
  }
</style>

<div>
  <form on:submit|preventDefault={addItem}>
    <input
      type="text"
      placeholder="What should I do ?"
      use:focus
      bind:this={textInput}
      bind:value={textInputValue}
    />
    <button type="submit" disabled={!textInputValue}>Add</button>
  </form>
  <div>
    Show :
    {#each filters as filter (filter)}
    <button
      class="filter"
      on:click|preventDefault={() => setFilter(filter)}
      disabled={filter === $filterName$}
    >
      {filter}
    </button>
    {/each}
  </div>
</div>
