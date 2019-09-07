<template>
  <li :class="{ done }">
    <input type="text" :value="text" @change.prevent="editItem" />
    <input type="checkbox" :checked="done" @change.prevent="checkItem" />
    <button @click.prevent="removeItem">X</button>
  </li>
</template>

<script>
import { edited, removed, done, reset } from '../../events/todo'

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
      const buildEvent = event.target.checked ? done : reset
      this.dispatch(buildEvent({ id: this.id }))
    }
  }
}
</script>

<style lang="scss" scoped>
input[type=text] {
  border: none;

  .done & {
    text-decoration: line-through;
  }
}
</style>
