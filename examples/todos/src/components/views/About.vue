<template>
  <div>
    <h1>About</h1>
    <ViewLink view="TodoApp">Todo app</ViewLink>
  </div>
</template>

<script>
import ViewLink from '../units/ViewLink.vue'

export default {
  name: 'about',
  components: {
    ViewLink
  }
}
</script>
