<script>
  import { withProjection, createDispatch } from '@coriolis/coriolis-svelte'

  import { eventListFilter } from '../../projections/eventListFilter'
  import { eventListFilterChange } from '../../events'

  const filter$ = withProjection(eventListFilter)
  const setEventListFilter = createDispatch(event => eventListFilterChange(event.target.value))
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
