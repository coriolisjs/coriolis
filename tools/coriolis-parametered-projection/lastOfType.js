import { parameteredProjection } from './parameteredProjection'
import { listNames } from './lib/array/listNames'

export const lastOfType = parameteredProjection(({ useParameteredEvent, setParameteredName }) => (
  setParameteredName((...eventBuilders) => `Last event of type ${listNames(eventBuilders)}`),
  useParameteredEvent(),
  event => event
))
