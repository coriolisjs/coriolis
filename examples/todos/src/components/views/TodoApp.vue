<template>
  <AppContainer>
    <h1>Ma liste de tâches</h1>
    <TodoControl />
    <TodoList />
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
