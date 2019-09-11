<template>
  <AppContainer>
    <h1>Ma liste de tâches</h1>
    <TodoControl />
    <TodoList class="todolist" />
    <ViewLink view="About">
      About
    </ViewLink>
  </AppContainer>
</template>

<script>
import AppContainer from '../units/AppContainer.vue'
import TodoControl from '../units/TodoControl.vue'
import TodoList from '../units/TodoList.vue'
import ViewLink from '../units/ViewLink.vue'

export default {
  name: 'todoApp',
  components: {
    AppContainer,
    TodoControl,
    TodoList,
    ViewLink
  }
}
</script>

<style lang="scss" scoped>
  .todolist {
    max-height: 60vh;
    overflow: auto;
    width: 60vw;
    margin: 1em auto;
    background: #f9f9f9;
    padding: 1em;
  }
</style>
