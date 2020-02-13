<script>
  import { createDispatch } from '@coriolis/coriolis-svelte'

  import { edited, removed, done, reset } from '../../events/todo'

  const dispatchRemoved = createDispatch(removed)
  const dispatchEdited = createDispatch(edited)
  const dispatchDone = createDispatch(done)
  const dispatchReset = createDispatch(reset)

  export let id
  export let text
  export let isDone

  let doneCheckbox

  const removeItem = () => dispatchRemoved({ id })

  const editItem = () => dispatchEdited({ id, text })

  const checkItem = () => {
    const dispatcher = doneCheckbox.checked ? dispatchDone : dispatchReset
    dispatcher({ id })
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
