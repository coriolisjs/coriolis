<template>
  <form ref="form" @submit.prevent="addItem">
    <input ref="textInput" type="text" placeholder="What should I do ?" />
    <button type="submit">Add</button>
  </form>
</template>

<script>
import { added } from '../../events/todo'

export default {
  name: 'todoControl',
  inject: [
    'dispatch'
  ],
  methods: {
    addItem () {
      this.dispatch(added({ text: this.$refs.textInput.value }))
      this.$refs.form.reset()
      this.$refs.textInput.focus()
    }
  },
  mounted () {
    this.$refs.textInput.focus()
  }
}
</script>
