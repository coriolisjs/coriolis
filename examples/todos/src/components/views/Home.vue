<template>
  <div id="home">
    <h1>Ma liste de tâches</h1>
    <TodoList />
  </div>
</template>

<script>
import TodoList from '../units/TodoList.vue'

export default {
  name: 'home',
  components: {
    TodoList
  }
}
</script>

<style>
#home {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
