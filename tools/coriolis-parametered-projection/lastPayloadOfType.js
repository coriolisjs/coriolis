import { parameteredProjection } from './parameteredProjection'

export const lastPayloadOfType = parameteredProjection(
  ({ useParameteredEvent, setName }) => (
    setName('Last payload of type'),
    useParameteredEvent(),
    ({ payload }) => payload
  )
)
