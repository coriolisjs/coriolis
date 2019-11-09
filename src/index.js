export { createStore, FIRST_EVENT_TYPE } from './eventStore'
export { createEventBuilder } from './eventBuilder'
export {
  createAggregator,
  createAggregatorFactory,
  parameteredAggr,
  snapshot
} from './aggregator'
export { lastOfType } from '../tools/aggr/lastOfType'
export { lastPayloadOfType } from '../tools/aggr/lastPayloadOfType'
