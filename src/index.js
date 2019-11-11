export { createStore, FIRST_EVENT_TYPE } from './eventStore'
export { createEventBuilder } from './eventBuilder'
export {
  createAggregator,
  createAggregatorFactory,
  snapshot
} from './aggregator'
export { parameteredAggr } from '../tools/aggr/parameteredAggr'
export { lastOfType } from '../tools/aggr/lastOfType'
export { lastPayloadOfType } from '../tools/aggr/lastPayloadOfType'
