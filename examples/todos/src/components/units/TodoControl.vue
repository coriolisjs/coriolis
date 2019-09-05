<template>
  <form @submit.prevent="addItem">
    <input type="text" placeholder="Text" />
    <button type="submit">Ajouter</button>
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
    addItem ({ target }) {
      this.dispatch(added({ text: target.elements[0].value }))
      target.reset()
      target.elements[0].focus()
    }
  }
}
</script>
