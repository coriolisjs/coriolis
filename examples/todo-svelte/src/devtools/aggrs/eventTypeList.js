
export const eventTypeIndex = (list = {}, event) => ({
  ...list,
  [event.type]: (list[event.type] || 0) + 1
})

export const eventTypeList = ({ useAggr }) => (
  useAggr(eventTypeIndex),
  index => Object.entries(index).map(([name, count]) => ({ name, count }))
)
