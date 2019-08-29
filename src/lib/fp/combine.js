const combine = functions => functions
  .reduce(
    (acc, func) => arg => {
      const result = acc(arg)
      result.push(func(arg))
      return result
    },
    () => []
  )

module.exports = {
  combine
}
