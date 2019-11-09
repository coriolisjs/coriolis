import { parameteredAggr } from './parameteredAggr'

export const lastOfType = parameteredAggr(({ useParameteredEvent }) => (
  useParameteredEvent(),
  event => event
))
