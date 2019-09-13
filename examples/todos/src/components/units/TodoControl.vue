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
import { added, filter, filters } from '../../events/todo'
import { todolistFilterName } from '../../aggrs/todo'

export default {
  name: 'todoControl',
  inject: [
    'dispatch',
    'pipeAggr'
  ],
  data () {
    return {
      filters,
      filterName: undefined,
      textInputValue: ''
    }
  },
  methods: {
    addItem () {
      if (!this.textInputValue) {
        return
      }
      this.dispatch(added({ text: this.$refs.textInput.value }))
      this.textInputValue = ''
      this.$refs.textInput.focus()
    },
    setFilter (filterName) {
      this.dispatch(filter({ filterName }))
    }
  },
  created () {
    this.filterNameSubscription = this.pipeAggr(todolistFilterName).subscribe(filterName => {
      this.filterName = filterName
    })
  },
  mounted () {
    this.$refs.textInput.focus()
  },
  beforeDestroy () {
    this.filterNameSubscription.unsubscribe()
  }
}
</script>
