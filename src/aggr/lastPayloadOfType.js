import { parameteredAggr } from '../aggregator'

export const lastPayloadOfType = parameteredAggr(({ useParameteredEvent }) => (
  useParameteredEvent(),
  ({ payload }) => payload
))
