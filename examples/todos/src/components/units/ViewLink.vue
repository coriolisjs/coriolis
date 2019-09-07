<template>
  <a :href="view" @click.prevent="trigger"><slot /></a>
</template>

<script>
import { changed } from '../../events/view'

export default {
  name: 'viewLink',
  inject: ['dispatch'],
  props: {
    view: String
  },
  methods: {
    trigger () {
      this.dispatch(changed({ view: this.view }))
    }
  }
}
</script>
