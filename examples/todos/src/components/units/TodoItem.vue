<template>
  <li>
    <p>{{ text }}</p>
  </li>
</template>

<script>
export default {
  name: 'todo-item',
  props: {
    id: Number,
    text: String,
    done: Boolean
  }
}
</script>
