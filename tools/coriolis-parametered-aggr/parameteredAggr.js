import { createIndex } from '../../src/lib/map/objectIndex'

// aggr wrapper that allow an aggr to be parametered and still have shared cached results
export const parameteredAggr = aggr =>
  createIndex((...args) => aggrAPI => {
    let count = 0

    const useParam = (idx = count++) => aggrAPI.useValue(args[idx])
    const useParameteredEvent = (from = 0, to) =>
      aggrAPI.useEvent(...args.slice(from, to))
    const useParameteredAggr = (parameteredAggr, from = 0, to) =>
      aggrAPI.useAggr(parameteredAggr(...args.slice(from, to)))
    return aggr({
      useParam,
      useParameteredEvent,
      useParameteredAggr,
      ...aggrAPI
    })
  }).get
