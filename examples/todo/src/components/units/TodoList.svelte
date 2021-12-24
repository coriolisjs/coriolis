<script>
  import { withProjection } from '@coriolis/coriolis-svelte'

  import TodoItem from './TodoItem.svelte'

  import { filteredTodolist } from '../../todo-core/projections/todo'

  let todolist$ = withProjection(filteredTodolist)
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
