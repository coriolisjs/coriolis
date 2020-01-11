<script>
  import { getContext } from 'svelte'

  import TodoItem from './TodoItem.svelte'

  import { filteredTodolist } from '../../projections/todo'

  const getSource = getContext('getSource')

  let todolist$ = getSource(filteredTodolist)
</script>

<ol class={$$props.class}>
{#each $todolist$ as item (item.id)}
  <TodoItem
    id={item.id}
    text={item.text}
    isDone={item.done}
  />
{/each}
</ol>
