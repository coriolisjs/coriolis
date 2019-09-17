<template>
  <AppContainer>
    <h1>About</h1>
    <ViewLink view="TodoApp">Todo app</ViewLink>
  </AppContainer>
</template>

<script>
import AppContainer from '../units/AppContainer.vue'
import ViewLink from '../units/ViewLink.vue'

export default {
  name: 'About',
  components: {
    AppContainer,
    ViewLink
  }
}
</script>
