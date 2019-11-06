import { parameteredAggr } from '../aggregator'

export const lastOfType = parameteredAggr(({ useParam, useState, useEvent }) => (
  useParam(),
  useState(),
  useEvent(),
  (eventType, lastEvent, event) =>
    event.type === eventType.toString()
      ? event
      : lastEvent
))
