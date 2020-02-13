import { parameteredProjection } from './parameteredProjection'
import { listNames } from './lib/array/listNames'

export const lastPayloadOfType = parameteredProjection(
  ({ useParameteredEvent, setParameteredName }) => (
    setParameteredName(
      (...eventBuilders) => `Last payload of type ${listNames(eventBuilders)}`,
    ),
    useParameteredEvent(),
    ({ payload }) => payload
  ),
)
