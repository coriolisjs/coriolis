<template>
  <li :class="{ done }">
    <input ref="textInput" type="text" :value="text" @change.prevent="editItem" />
    <input ref="doneCheckbox" type="checkbox" :checked="done" @change.prevent="checkItem" />
    <button @click.prevent="removeItem">Remove</button>
  </li>
</template>

<script>
import { edited, removed, done, reset } from '../../events/todo'

export default {
  name: 'TodoItem',
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
      this.dispatch(edited({ id: this.id, text: this.$refs.textInput.value }))
    },
    checkItem () {
      const buildEvent = this.$refs.doneCheckbox.checked ? done : reset
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
