import { map } from 'rxjs/operators'

const createStreamBinder = vm => (key, stream) =>
  stream.subscribe(data => vm.$set(vm, key, data))

const createEventSubscriber = vm => (eventName, listener) => {
  vm.$on(eventName, listener)

  return {
    unsubscribe: () => vm.$off(eventName, listener)
  }
}

const protect = data => {
  if (Array.isArray(data)) {
    return data.map(protect)
  }

  if (typeof data === 'object') {
    return Object.entries(data)
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: protect(value)
      }), {})
  }

  return data
}

export const connect = ({ mapProjection = {}, mapProtectedProjection = {}, eventDispatch = {} }) => {
  const initialData = {
    ...Object.keys({
      ...mapProjection,
      ...mapProtectedProjection
    }).reduce((acc, key) => ({ ...acc, [key]: undefined }), {})
  }

  return component => ({
    name: `connected-${component.name}`,
    mixins: [component],
    inject: [
      'dispatchEvent',
      'withProjection'
    ],
    data: () => initialData,
    created () {
      const bindStream = createStreamBinder(this)
      const subscribeEvent = createEventSubscriber(this)
      this.subscriptions = []

      if (mapProjection) {
        this.subscriptions.push(
          ...Object.entries(mapProjection)
            .map(([key, source]) => bindStream(key, this.withProjection(source)))
        )
      }

      if (mapProtectedProjection) {
        this.subscriptions.push(
          ...Object.entries(mapProtectedProjection)
            .map(([key, source]) => bindStream(
              key,
              this.withProjection(source).pipe(map(protect))
            ))
        )
      }

      if (eventDispatch) {
        this.subscriptions.push(
          ...Object.entries(eventDispatch)
            .map(([eventName, eventBuilder]) =>
              subscribeEvent(eventName, (...args) => this.dispatchEvent(eventBuilder(...args))))
        )
      }
    },
    beforeDestroy () {
      this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  })
}
