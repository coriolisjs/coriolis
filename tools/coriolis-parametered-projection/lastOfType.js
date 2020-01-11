import { parameteredProjection } from './parameteredProjection'

export const lastOfType = parameteredProjection(({ useParameteredEvent }) => (
  useParameteredEvent(),
  event => event
))
