import { createEventBuilder } from 'coriolis'

export const viewChanged = createEventBuilder('Coriolis devtools current view changed', viewname => viewname)

export const devtoolsOpened = createEventBuilder('Coriolis devtools have been opened')
export const devtoolsClosed = createEventBuilder('Coriolis devtools have been closed')

export const devtoolsEventListFilterChange = createEventBuilder('Coriolis devtools event list filter have been changed', filter => filter)

export const devtoolsTimingTypeSelected = createEventBuilder('Coriolis devtools timing type for event display have been selected', type => type)

export const devtoolsAggregatorCreated = createEventBuilder('Coriolis devtools detected an aggregator creation', ({ storeId, aggrId, aggr }) => ({ storeId, aggr }))
export const devtoolsAggrCalled = createEventBuilder('Coriolis devtools detected an aggr have been called', ({ storeId, aggr }) => ({ storeId, aggr }))
export const devtoolsAggregatorCalled = createEventBuilder('Coriolis devtools detected an aggregator have been called', ({ storeId, aggr }) => ({ storeId, aggr }))

export const eventStoreAdded = createEventBuilder('Coriolis devtools registered new event store', ({ storeId, storeName }) => ({ storeId, storeName }))
export const eventStoreEvent = createEventBuilder('Coriolis devtools detected an event', ({ storeId, event }) => ({ storeId, event }))
