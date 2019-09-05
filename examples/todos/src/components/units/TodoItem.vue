<template>
  <li>
    <input type="text" :value="text" @change.prevent="editItem" />
    <input type="checkbox" :checked="done" @change.prevent="checkItem" />
    <button @click.prevent="removeItem">X</button>
  </li>
</template>

<script>
import { edited, removed, done } from '../../events/todo'

export default {
  name: 'todo-item',
  inject: [
    'dispatch'
  ],
  props: {
    id: Number,
    text: String,
    done: Boolean
  },
  methods: {
    removeItem () {
      this.dispatch(removed({ id: this.id }))
    },
    editItem () {
      this.dispatch(edited({ id: this.id, text: event.target.value }))
    },
    checkItem () {
      this.dispatch(done({ id: this.id }))
    }
  }
}
</script>

<style lang="scss" scoped>
input[type=text] {
  border: none;
}
</style>
