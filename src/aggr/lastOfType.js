import { parameteredAggr } from '../aggregator'

export const lastOfType = parameteredAggr(({ useParameteredEvent }) => (
  useParameteredEvent(),
  event => event
))
