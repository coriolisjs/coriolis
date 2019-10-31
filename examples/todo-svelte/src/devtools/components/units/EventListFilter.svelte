<script>
  import { getContext } from 'svelte'

  import { devtoolsEventListFilterChange } from '../../events'
  import { eventListFilter } from '../../aggrs/eventListFilter'

  const getSource = getContext('getSource')
  const dispatch = getContext('dispatch')

  const filter$ = getSource(eventListFilter)
  const setEventListFilter = event => dispatch(devtoolsEventListFilterChange(event.target.value))
</script>

<style>
  input {
    padding: .2em;
    background: rgba(white, .5);
  }
</style>

<input
  type="text"
  placeholder="filter"
  value={$filter$ || ''}
  on:input={setEventListFilter}
/>
