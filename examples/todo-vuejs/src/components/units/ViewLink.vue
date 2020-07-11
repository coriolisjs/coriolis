<template>
  <a :href="view" @click.prevent="trigger"><slot /></a>
</template>

<script>
import { connect } from '../../libs/vuejs/connect'

import { changed } from '../../events/view'

const ViewLink = {
  name: 'ViewLink',
  props: {
    view: String,
  },
  methods: {
    trigger() {
      this.$emit('switch', { view: this.view })
    },
  },
}

export default connect({
  eventDispatch: {
    switch: changed,
  },
})(ViewLink)

</script>
