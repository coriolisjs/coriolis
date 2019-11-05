import { createCustomElement } from '../lib/browser/customElement'
import { ensureFeatures } from '../lib/browser/loadScript'

import { views } from '../components/views'

import { eventList } from '../aggrs/eventList'
import { eventTypeList } from '../aggrs/eventTypeList'
import { eventListFilter } from '../aggrs/eventListFilter'
import { currentStoreSnapshot } from '../aggrs/currentStoreSnapshot'
import { aggrsList } from '../aggrs/aggrsList'
import { viewList } from '../aggrs/viewList'
import { enabledViewName } from '../aggrs/enabledViewName'

import { viewAdded } from '../events'

import { nav } from './nav'

export const createUI = () => ({ addEffect, addSource, withAggr, eventSource }) => {
  addSource(views.map(viewAdded))
  addEffect(nav)

  withAggr(enabledViewName).connect()
  withAggr(viewList).connect()
  withAggr(eventList).connect()
  withAggr(eventTypeList).connect()
  withAggr(eventListFilter).connect()
  withAggr(currentStoreSnapshot).connect()
  withAggr(aggrsList).connect()

  let elementMounted = false

  createCustomElement(
    'coriolis-dev-tools',
    () =>
    class extends HTMLElement {
      connectedCallback() {
        if (elementMounted) {
          // eslint-disable-next-line no-console
          console.warn('Trying to mount Coriolis dev tools twice... useless');
          return;
        }
        elementMounted = true;

        ensureFeatures({
          check: ({ default: Entry } = {}) => Entry,
          load: () => import('../components/Entry.svelte'),
        }).then(
          ([Entry]) => {
            if (!elementMounted) {
              // element was unmounted while loading dependencies, don't go further
              return;
            }

            this.app = new Entry({
              target: this,
              props: {
                dispatch: event => eventSource.next(event),
                getSource: withAggr
              }
            })
          },
          error => {
            // eslint-disable-next-line no-console
            console.error(
              'Could not load all dependencies for Coriolis dev tools',
              error
            );
          }
        );
      }

      disconnectedCallback() {
        elementMounted = false;

        if (this.app) {
          this.app.$destroy()
        }
      }
    }
  )
}
