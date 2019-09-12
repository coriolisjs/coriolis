
const typeStyle = 'color: silver; font-weight: bold'

const norm = type => {
  if (type.length > 20) {
    return `${type.slice(0, 20)}... `
  }

  return type.padEnd(24, ' ')
}

const logSubscriber = (prefix, ...args) => ({
  next: ({ type, payload }) => console.log(`${prefix} %c ${norm(type)}`, ...args.slice(0, 1), typeStyle, payload, ...args.slice(1)),
  error: error => console.error(`${prefix} error`, ...args, error),
  complete: () => console.info(`Completed ${prefix}`, ...args)
})

export const logEvents = ({ initialEvent$, addLogger }) => {
  const removeLogger = addLogger(logSubscriber('🖋'))
  const initialEventsSubscription = initialEvent$.subscribe(logSubscriber('🌀'))

  return () => {
    initialEventsSubscription.unsubscribe()
    removeLogger()
  }
}
