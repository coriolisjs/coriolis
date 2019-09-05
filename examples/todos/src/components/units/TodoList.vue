<template>
  <div>
    <ol>
      <TodoItem
        v-for="item in todolist"
        :key="item.id"
        :id="item.id"
        :text="item.text"
        :done="item.done"
      />
    </ol>
  </div>
</template>

<script>
import TodoItem from './TodoItem'

import { todolist } from '../../reducers/todo'
import { added } from '../../events/todo'

export default {
  name: 'todo-list',
  components: {
    TodoItem
  },
  inject: [
    'pipeReducer'
  ],
  created () {
    this.pipeReducer(todolist).subscribe(todolist => {
      // kind of clone objects to avoid mutate reducer's state
      // TODO: find a better way to prevent vue from mutate the nested data
      this.todolist = todolist.map(item => ({ ...item }))
    })
  },
  data () {
    return {
      todolist: []
    }
  }
}
</script>
