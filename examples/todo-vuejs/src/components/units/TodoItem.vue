<template>
  <li :class="{ done }">
    <input ref="textInput" type="text" :value="text" @change.prevent="editItem" />
    <input ref="doneCheckbox" type="checkbox" :checked="done" @change.prevent="checkItem" />
    <button @click.prevent="removeItem">Remove</button>
  </li>
</template>

<script>
import { connect } from '../../libs/vuejs/connect'

import { edited, removed, done, reset } from '../../events/todo'

const TodoItem = {
  name: 'TodoItem',
  props: {
    id: Number,
    text: String,
    done: Boolean
  },
  methods: {
    removeItem () {
      this.$emit('removed', { id: this.id })
    },
    editItem () {
      this.$emit('edited', { id: this.id, text: this.$refs.textInput.value })
    },
    checkItem () {
      const eventName = this.$refs.doneCheckbox.checked ? 'done' : 'reset'
      this.$emit(eventName, { id: this.id })
    }
  }
}

export default connect({
  eventDispatch: {
    removed,
    edited,
    done,
    reset
  }
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
