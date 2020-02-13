import { lastPayloadOfType } from '@coriolis/parametered-projection'

import { createCustomElement } from '../lib/browser/customElement'
import { ensureFeatures } from '../lib/browser/loadScript'

import { views } from '../components/views'

import { isDevtoolsOpen } from '../projections/isDevtoolsOpen'
import { enabledViewName } from '../projections/enabledViewName'
import { viewList } from '../projections/viewList'
import { eventList } from '../projections/eventList'
import { eventTypeList } from '../projections/eventTypeList'
import { eventListFilter } from '../projections/eventListFilter'
import { currentStoreSnapshot } from '../projections/currentStoreSnapshot'
import { projectionsList } from '../projections/projectionsList'

import { viewAdded, panelWidthChanged } from '../events'

import { nav } from './nav'

export const createUI = () => ({
  addEffect,
  addSource,
  withProjection,
  dispatchEvent,
}) => {
  addSource(views.map(viewAdded))

  addEffect(nav)

  withProjection(lastPayloadOfType(panelWidthChanged)).connect()
  withProjection(isDevtoolsOpen).connect()
  withProjection(enabledViewName).connect()
  withProjection(viewList).connect()
  withProjection(eventList).connect()
  withProjection(eventTypeList).connect()
  withProjection(eventListFilter).connect()
  withProjection(currentStoreSnapshot).connect()
  withProjection(projectionsList).connect()

  let elementMounted = false

  createCustomElement(
    'coriolis-dev-tools',
    () =>
      class extends HTMLElement {
        connectedCallback() {
          if (elementMounted) {
            // eslint-disable-next-line no-console
            console.warn('Trying to mount Coriolis dev tools twice... useless')
            return
          }
          elementMounted = true

          // eslint-disable-next-line promise/catch-or-return
          ensureFeatures({
            check: ({ default: Entry, setStoreAPI } = {}) =>
              Entry && setStoreAPI && { Entry, setStoreAPI },
            load: () => import('../components/Entry.svelte'),
          }).then(
            ([{ Entry, setStoreAPI }]) => {
              // eslint-disable-next-line promise/always-return
              if (!elementMounted) {
                // element was unmounted while loading dependencies, don't go further
                return
              }

              setStoreAPI({ dispatchEvent, withProjection })

              this.app = new Entry({
                target: this,
              })
            },
            error => {
              // eslint-disable-next-line no-console
              console.error(
                'Could not load all dependencies for Coriolis dev tools',
                error,
              )
            },
          )
        }

        disconnectedCallback() {
          elementMounted = false

          if (this.app) {
            this.app.$destroy()
          }
        }
      },
  )
}
