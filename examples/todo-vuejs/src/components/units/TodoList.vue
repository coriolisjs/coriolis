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

import { connect } from '../../libs/vuejs/connect'

import { filteredTodolist } from '../../projections/todo'

const TodoList = {
  name: 'TodoList',
  components: {
    TodoItem
  },
  data: () => ({
    todolist: []
  })
}

export default connect({
  mapProtectedSource: {
    todolist: filteredTodolist
  }
})(TodoList)
</script>
