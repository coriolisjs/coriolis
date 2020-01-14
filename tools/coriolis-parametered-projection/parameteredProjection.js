import { createIndex } from './lib/map/objectIndex'

// projection wrapper that allow an projection to be parametered and still have shared cached results
export const parameteredProjection = projection =>
  createIndex((...args) => projectionAPI => {
    let count = 0

    const useParam = (idx = count++) => projectionAPI.useValue(args[idx])
    const useParameteredEvent = (from = 0, to) =>
      projectionAPI.useEvent(...args.slice(from, to))
    const useParameteredProjection = (parameteredProjection, from = 0, to) =>
      projectionAPI.useProjection(parameteredProjection(...args.slice(from, to)))
    return projection({
      useParam,
      useParameteredEvent,
      useParameteredProjection,
      ...projectionAPI
    })
  }).get
