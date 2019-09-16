import { truncate } from '../libs/string/truncate'

const typeStyle = 'color: silver; font-weight: bold'
const trunc = truncate(24)

const log = (...args) => console.log(...args)
const logInfo = (...args) => console.info(...args)
const logError = (...args) => console.error(...args)

const logSubscriber = (prefix, ...args) => ({
  next: ({ type, payload }) => log(
    `${prefix} %c ${trunc(type)}`,
    ...args.slice(0, 1),
    typeStyle,
    payload,
    ...args.slice(1)
  ),
  error: error => logError(`${prefix} error`, ...args, error),
  complete: () => logInfo(`Completed ${prefix}`, ...args)
})

export const logEvents = ({ initialEvent$, addLogger }) => {
  const removeLogger = addLogger(logSubscriber('🖋'))
  const initialEventsSubscription = initialEvent$.subscribe(logSubscriber('🌀'))

  return () => {
    // not using .add() here to join both tear-downs, to avoid initialEvents completion to
    // cause call of logger tear-down
    initialEventsSubscription.unsubscribe()
    removeLogger()
  }
}
