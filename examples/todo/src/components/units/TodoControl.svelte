<script>
  import { withProjection, createDispatch } from '@coriolis/coriolis-svelte'

  import { addItem } from '../../todo-core/commands/todo/addItem'
  import { filters } from '../../todo-core/data/filters'
  import { setFilter } from '../../todo-core/commands/todo/setFilter'

  import { todolistFilterName } from '../../todo-core/projections/todo'

  const dispatchAddItem = createDispatch(addItem)
  const dispatchFilter = createDispatch(setFilter)

  let filterName$ = withProjection(todolistFilterName)
  let textInput
  let textInputValue

  const submitItem = () => {
    dispatchAddItem(textInputValue)
    textInputValue = ''
    textInput.focus()
  }

  const focus = (el) => el.focus()
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
  <form on:submit|preventDefault={submitItem}>
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
    {#each filters as filterName (filterName)}
    <button
      class="filter"
      on:click|preventDefault={() => dispatchFilter(filterName)}
      disabled={filterName === $filterName$}
    >
      {filterName}
    </button>
    {/each}
  </div>
</div>
