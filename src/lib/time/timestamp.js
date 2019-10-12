import { hrToMs } from './hrToMs'

const hasPerformance = typeof performance !== 'undefined'
const hasHr = typeof process !== 'undefined' && !!process.hrtime

const dateRef =
  (hasPerformance && performance.timing.navigationStart) ||
  +new Date()

const timeDeltaRef = hasHr && process.hrtime()

export const getTimestamp =
  (hasPerformance && (() => dateRef + performance.now())) ||
  (hasHr && (() => dateRef + hrToMs(process.hrtime(timeDeltaRef)))) ||
  (() => +new Date())
