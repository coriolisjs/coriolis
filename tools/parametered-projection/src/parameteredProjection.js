import { createIndex } from './lib/map/objectIndex'

const identity = arg => arg

// projection wrapper that allow an projection to be parametered and still have shared cached results
export const parameteredProjection = projection =>
  createIndex((...args) => projectionAPI => {
    let count = 0

    const useParam = (idx = count++) => projectionAPI.useValue(args[idx])

    const useParameteredEvent = (from = 0, to) =>
      projectionAPI.useEvent(...args.slice(from, to))

    const useParameteredProjection = (from = 0, projectionGetter = identity) =>
      []
        .concat(projectionGetter(...args.slice(from)))
        .forEach(projectionAPI.useProjection)

    const setParameteredName = (nameBuilder, from = 0, to) =>
      projectionAPI.setName(nameBuilder(...args.slice(from, to)))

    return projection({
      useParam,
      useParameteredEvent,
      useParameteredProjection,
      setParameteredName,
      ...projectionAPI,
    })
  }).get
