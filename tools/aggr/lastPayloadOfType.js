import { parameteredAggr } from './parameteredAggr'

export const lastPayloadOfType = parameteredAggr(({ useParameteredEvent }) => (
  useParameteredEvent(),
  ({ payload }) => payload
))
