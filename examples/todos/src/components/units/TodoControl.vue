<template>
  <div>
    <form ref="addForm" @submit.prevent="addItem">
      <input ref="textInput" type="text" placeholder="What should I do ?" v-model="textInputValue" />
      <button type="submit" :disabled="!textInputValue">Add</button>
    </form>
    <div>
      Show :
      <button
        v-for="filter in filters"
        :key="filter"
        @click.prevent="setFilter(filter)"
        :disabled="filter === filterName"
      >
        {{filter}}
      </button>
    </div>
  </div>
</template>

<script>
import { connect } from '../../libs/vuejs/connect'

import { added, filter, filters } from '../../events/todo'
import { todolistFilterName } from '../../aggrs/todo'

const TodoControl = {
  name: 'TodoControl',
  data: () => ({
    filters: filters.slice(),
    filterName: undefined,
    textInputValue: ''
  }),
  methods: {
    addItem () {
      if (!this.textInputValue) {
        return
      }
      this.$emit('added', { text: this.$refs.textInput.value })
      this.textInputValue = ''
      this.$refs.textInput.focus()
    },
    setFilter (filterName) {
      this.$emit('filter', { filterName })
    }
  },
  mounted () {
    this.$refs.textInput.focus()
  }
}

export default connect({
  mapSource: {
    filterName: todolistFilterName
  },
  eventDispatch: {
    added,
    filter
  }
})(TodoControl)

</script>
