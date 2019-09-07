<template>
  <div id="todoApp">
    <h1>Ma liste de tâches</h1>
    <TodoControl />
    <TodoList />
    <ViewLink view="About">
      About
    </ViewLink>
  </div>
</template>

<script>
import TodoControl from '../units/TodoControl.vue'
import TodoList from '../units/TodoList.vue'
import ViewLink from '../units/ViewLink.vue'

export default {
  name: 'todoApp',
  components: {
    TodoControl,
    TodoList,
    ViewLink
  }
}
</script>

<style>
#todoApp {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
