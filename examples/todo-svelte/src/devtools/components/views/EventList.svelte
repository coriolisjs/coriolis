<script>
  import { getContext } from 'svelte'

  import EventList from '../units/EventList.svelte'
  import DevToolsContainer from '../units/DevToolsContainer.svelte'

  import { devtoolsEventListFilterChange } from '../../events'
  import { eventListFilter } from '../../aggrs/eventListFilter'

  const getSource = getContext('getSource')
  const dispatch = getContext('dispatch')

  const filter$ = getSource(eventListFilter)
  const setEventListFilter = event => dispatch(devtoolsEventListFilterChange(event.target.value))
</script>

<DevToolsContainer>
  <h2 slot="title">Liste des events</h2>
  <div slot="tools">
    <input
      type="text"
      placeholder="filter"
      value={$filter$ || ''}
      on:input={setEventListFilter}
    />
  </div>
  <EventList />
</DevToolsContainer>
