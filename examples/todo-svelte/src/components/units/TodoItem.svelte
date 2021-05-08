<script>
  import { createDispatch } from '@coriolis/coriolis-svelte'

  import { removeItem } from '../../todo-core/commands/todo/removeItem'
  import { editItem } from '../../todo-core/commands/todo/editItem'
  import { toggleDone } from '../../todo-core/commands/todo/toggleDone'

  const dispatchRemove = createDispatch(removeItem)
  const dispatchEdit = createDispatch(editItem)
  const dispatchToggleDone = createDispatch(toggleDone)

  export let id
  export let text
  export let isDone

  const doRemoveItem = () => dispatchRemove(id)
  const doEditItem = () => dispatchEdit(id, text)
  const checkItem = () => dispatchToggleDone(id)
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
  <input type="text" bind:value={text} on:change|preventDefault={doEditItem} />
  <input type="checkbox" bind:checked={isDone} on:change|preventDefault={checkItem} />
  <button on:click|preventDefault={doRemoveItem}>Remove</button>
</li>
