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

import { filteredTodolist } from '../../reducers/todo'
import { added } from '../../events/todo'

export default {
  name: 'todo-list',
  components: {
    TodoItem
  },
  inject: [
    'pipeReducer'
  ],
  data () {
    return {
      todolist: [],
      filterName: undefined
    }
  },
  created () {
    this.todolistSubscription = this.pipeReducer(filteredTodolist).subscribe(todolist => {
      // kind of clone objects to avoid mutate reducer's state
      // TODO: find a better way to prevent vue from mutate the nested data
      this.todolist = todolist.map(item => ({ ...item }))
    })
  },
  beforeDestroy () {
    this.todolistSubscription.unsubscribe()
  }
}
</script>
