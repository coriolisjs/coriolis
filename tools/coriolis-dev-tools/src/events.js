import { createEventBuilder } from 'coriolis'

export const viewAdded = createEventBuilder(
  'Coriolis devtools new view added',
  ({ name, longname }) => ({ name, longname }),
)
export const viewChanged = createEventBuilder(
  'Coriolis devtools current view changed',
  viewname => viewname,
)

export const devtoolsOpened = createEventBuilder(
  'Coriolis devtools have been opened',
)
export const devtoolsClosed = createEventBuilder(
  'Coriolis devtools have been closed',
)

export const eventListFilterChange = createEventBuilder(
  'Coriolis devtools event list filter have been changed',
  filter => filter,
)

export const timingTypeSelected = createEventBuilder(
  'Coriolis devtools timing type for event display have been selected',
  type => type,
)

export const aggregatorCreated = createEventBuilder(
  'Coriolis devtools detected an aggregator creation',
  ({ storeId, aggrId, aggr, aggregator }) => ({
    storeId,
    aggrId,
    aggr,
    aggregator,
  }),
)
export const aggrSetup = createEventBuilder(
  'Coriolis devtools detected an aggr have been setup',
  ({ storeId, aggrId, aggrBehavior }) => ({ storeId, aggrId, aggrBehavior }),
)
export const aggrCalled = createEventBuilder(
  'Coriolis devtools detected an aggr have been called',
  ({ storeId, aggrId, args, newState }) => ({
    storeId,
    aggrId,
    args,
    newState,
  }),
)
export const aggregatorCalled = createEventBuilder(
  'Coriolis devtools detected an aggregator have been called',
  ({ storeId, aggrId, event }) => ({ storeId, aggrId, event }),
)

export const storeAdded = createEventBuilder(
  'Coriolis devtools registered new event store',
  ({ storeId, storeName, snapshot$ }) => ({ storeId, storeName, snapshot$ }),
)
export const currentStoreChanged = createEventBuilder(
  'Coriolis devtools current event store have been changed',
  storeId => storeId,
)
export const storeEvent = createEventBuilder(
  'Coriolis devtools detected an event',
  ({ storeId, event, isInitialEvent }) => ({
    storeId,
    event,
    isInitialEvent: !!isInitialEvent,
  }),
)
