import { merge } from 'rxjs'

export const parallel = combine => (...operators) => source => combine(
  ...operators.map(operator => source.pipe(operator))
)

export const parallelMerge = parallel(merge)
