<template>
  <a :href="view" @click.prevent="trigger"><slot /></a>
</template>

<script>
import { connect } from '../../libs/vuejs/connect'

import { changeView } from '../../todo-core/commands/changeView'

const ViewLink = {
  name: 'ViewLink',
  props: {
    view: String,
  },
  methods: {
    trigger() {
      this.$emit('switch', this.view)
    },
  },
}

export default connect({
  eventDispatch: {
    switch: changeView,
  },
})(ViewLink)

</script>
