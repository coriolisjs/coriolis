import { parameteredAggr } from './parameteredAggr'

export const lastPayloadOfType = parameteredAggr(
  ({ useParameteredEvent, setName }) => (
    setName('Last payload of type'),
    useParameteredEvent(),
    ({ payload }) => payload
  )
)
