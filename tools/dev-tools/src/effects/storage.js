import { panelWidthChanged, devtoolsOpened, devtoolsClosed } from '../events'

export const storage = ({ addLogger, addSource }) => {
  const initialPanelWidth = window.localStorage.getItem(
    'Coriolis-dev-tools-panel-size',
  )

  const isPanelOpened = JSON.parse(
    window.localStorage.getItem('Coriolis-dev-tools-open'),
  )

  if (initialPanelWidth) {
    addSource([panelWidthChanged(Number(initialPanelWidth))])
  }

  if (isPanelOpened) {
    addSource([devtoolsOpened()])
  }

  addLogger(event => {
    if (event.type === panelWidthChanged.toString()) {
      window.localStorage.setItem(
        'Coriolis-dev-tools-panel-size',
        event.payload,
      )
    } else if (event.type === devtoolsOpened.toString()) {
      window.localStorage.setItem('Coriolis-dev-tools-open', true)
    } else if (event.type === devtoolsClosed.toString()) {
      window.localStorage.setItem('Coriolis-dev-tools-open', false)
    }
  })
}
