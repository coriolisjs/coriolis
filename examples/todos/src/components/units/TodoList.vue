<template>
  <ol>
    <TodoItem
      v-for="item in todolist"
      :key="item.id"
      :id="item.id"
      :text="item.text"
      :done="item.done"
    />
  </ol>
</template>

<script>
import TodoItem from './TodoItem'

import { filteredTodolist } from '../../aggrs/todo'
import { added } from '../../events/todo'

export default {
  name: 'todo-list',
  components: {
    TodoItem
  },
  inject: [
    'pipeAggr'
  ],
  data () {
    return {
      todolist: [],
      filterName: undefined
    }
  },
  created () {
    this.todolistSubscription = this.pipeAggr(filteredTodolist).subscribe(todolist => {
      // kind of clone objects to avoid mutate aggr's state
      // TODO: find a better way to prevent vue from mutate the nested data
      this.todolist = todolist.map(item => ({ ...item }))
    })
  },
  beforeDestroy () {
    this.todolistSubscription.unsubscribe()
  }
}
</script>
