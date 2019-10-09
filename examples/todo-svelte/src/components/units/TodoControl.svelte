<script>
  import { getContext, onMount } from 'svelte'

  import { added, filter, filters } from '../../events/todo'
  import { todolistFilterName } from '../../aggrs/todo'

  const dispatch = getContext('dispatch')
  const getSource = getContext('getSource')

  let filterName$ = getSource(todolistFilterName)
  let textInput
  let textInputValue

  const addItem = () => {
    if (!textInputValue) {
      return
    }

    dispatch(added({ text: textInputValue }))
    textInputValue = ''
    textInput.focus()
  }

  const setFilter = filterName => {
    dispatch(filter({ filterName }))
  }

  onMount(() => textInput.focus())
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
