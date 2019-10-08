<script>
import { getContext, createEventDispatcher, onMount, onDestroy } from 'svelte'

import { added, filter, filters } from '../../events/todo'
import { todolistFilterName } from '../../aggrs/todo'

const dispatch = getContext('dispatch')
const getSource = getContext('getSource')

let filterName
let textInput
let textInputValue

const subscription = getSource(todolistFilterName, newFilterName => { filterName = newFilterName })

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
onDestroy(() => subscription.unsubscribe())

</script>

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
      on:click|preventDefault={() => setFilter(filter)}
      disabled={filter === filterName}
    >
      {filter}
    </button>
    {/each}
  </div>
</div>
