<script>
import { getContext } from 'svelte'

import { edited, removed, done, reset } from '../../events/todo'

const dispatch = getContext('dispatch')

export let id
export let text
export let isDone

let doneCheckbox

const removeItem = () => dispatch(removed({ id }))

const editItem = () => dispatch(edited({ id, text }))

const checkItem = () => {
  const eventBuilder = doneCheckbox.checked ? done : reset
  dispatch(eventBuilder({ id }))
}

</script>

<style>
  input[type=text] {
    border: none;

  }
  .done  input[type=text] {
    text-decoration: line-through;
  }
</style>

<li class:done={isDone}>
  <input type="text" value={text} on:change|preventDefault={editItem} />
  <input bind:this={doneCheckbox} type="checkbox" checked={isDone} on:change|preventDefault={checkItem} />
  <button on:click|preventDefault={removeItem}>Remove</button>
</li>
