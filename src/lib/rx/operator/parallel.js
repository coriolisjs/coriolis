const { merge } = require('rxjs')

const parallel = combine => (...operators) => source => combine(
  ...operators.map(operator => source.pipe(operator))
)

const parallelMerge = parallel(merge)

module.exports = {
  parallel,
  parallelMerge
}
