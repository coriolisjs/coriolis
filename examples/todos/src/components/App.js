import Home from './views/Home.vue'

export default (eventSource, pipeReducer) => ({
  name: 'app',
  components: {
    Home
  },
  provide: {
    dispatch: event => eventSource.next(event),
    event$: eventSource.asObservable(),
    pipeReducer
  },
  data () {
    return {
      appdata: undefined
    }
  },
  render: (h) => h(Home)
})
