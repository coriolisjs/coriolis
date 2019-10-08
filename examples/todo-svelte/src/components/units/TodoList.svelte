<script>
import { getContext, onDestroy } from 'svelte'

import TodoItem from './TodoItem.svelte'

import { filteredTodolist } from '../../aggrs/todo'

const getSource = getContext('getSource')

let todolist = []

const subscription = getSource(filteredTodolist, newtodolist => { todolist = newtodolist })

onDestroy(() => subscription.unsubscribe())

</script>

<ol>
{#each todolist as item (item.id)}
  <TodoItem
    id={item.id}
    text={item.text}
    isDone={item.done}
  />
{/each}
</ol>
