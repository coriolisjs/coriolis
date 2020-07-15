<template>
  <li :class="{ done }">
    <input ref="textInput" type="text" :value="text" @change.prevent="editItem" />
    <input ref="doneCheckbox" type="checkbox" :checked="done" @change.prevent="checkItem" />
    <button @click.prevent="removeItem">Remove</button>
  </li>
</template>

<script>
import { connect } from '../../libs/vuejs/connect'

import { toggleDone } from '../../todo-core/commands/todo'
import { edited, removed } from '../../todo-core/events/todo'

const TodoItem = {
  name: 'TodoItem',
  props: {
    id: Number,
    text: String,
    done: Boolean,
  },
  methods: {
    removeItem() {
      this.$emit('removed', { id: this.id })
    },
    editItem() {
      this.$emit('edited', { id: this.id, text: this.$refs.textInput.value })
    },
    checkItem() {
      this.$emit('toggleDone', this.id)
    },
  },
}

export default connect({
  eventDispatch: {
    removed,
    edited,
    toggleDone,
  },
})(TodoItem)

</script>

<style lang="scss" scoped>
input[type=text] {
  border: none;

  .done & {
    text-decoration: line-through;
  }
}
</style>
