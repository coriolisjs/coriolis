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

import { addItem } from '../../todo-core/commands/todo/addItem'
import { filters } from '../../todo-core/data/filters'
import { setFilter } from '../../todo-core/commands/todo/setFilter'

import { todolistFilterName } from '../../todo-core/projections/todo'

const TodoControl = {
  name: 'TodoControl',
  data: () => ({
    filters: filters.slice(),
    filterName: undefined,
    textInputValue: '',
  }),
  methods: {
    addItem() {
      if (!this.textInputValue) {
        return
      }
      this.$emit('addItem', this.textInputValue)
      this.textInputValue = ''
      this.$refs.textInput.focus()
    },
    setFilter(filterName) {
      this.$emit('filter', filterName)
    },
  },
  mounted() {
    this.$refs.textInput.focus()
  },
}

export default connect({
  mapProjection: {
    filterName: todolistFilterName,
  },
  eventDispatch: {
    addItem,
    filter: setFilter,
  },
})(TodoControl)

</script>
