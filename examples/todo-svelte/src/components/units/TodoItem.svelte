<script>
  import { createDispatch } from '@coriolis/coriolis-svelte'

  import { edited, removed, done, reset } from '../../events/todo'
  import { toggleDone } from '../../commands/todo'

  const dispatchRemoved = createDispatch(removed)
  const dispatchEdited = createDispatch(edited)
  const dispatchToggleDone = createDispatch(toggleDone)

  export let id
  export let text
  export let isDone

  const removeItem = () => dispatchRemoved({ id })
  const editItem = () => dispatchEdited({ id, text })
  const checkItem = () => dispatchToggleDone(id, isDone)
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
  <input type="checkbox" checked={isDone} on:change|preventDefault={checkItem} />
  <button on:click|preventDefault={removeItem}>Remove</button>
</li>
