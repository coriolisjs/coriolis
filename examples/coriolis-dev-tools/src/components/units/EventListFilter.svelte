<script>
  import { getSource, createDispatch } from '../../lib/svelte/coriolis'

  import { eventListFilter } from '../../aggrs/eventListFilter'
  import { devtoolsEventListFilterChange } from '../../events'

  const filter$ = getSource(eventListFilter)
  const setEventListFilter = createDispatch(event => devtoolsEventListFilterChange(event.target.value))
</script>

<style>
  input {
    padding: .2em;
    background: rgba(255, 255, 255, .5);
  }
</style>

<input
  type="text"
  placeholder="filter"
  value={$filter$ || ''}
  on:input={setEventListFilter}
/>
