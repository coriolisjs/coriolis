<script>
  import { getSource, createDispatch } from '@coriolis/coriolis-svelte'
  import { lastPayloadOfType } from '@coriolis/parametered-projection'

  import { viewList } from '../../projections/viewList'
  import { isDevtoolsOpen } from '../../projections/isDevtoolsOpen'
  import { devtoolsClosed, panelWidthChanged } from '../../events'

  import NavButton from './NavButton.svelte'

  import { subscribeEvent } from '../../lib/dom/subscribeEvent'
  import { rafThrottle } from '../../lib/browser/rafThrottle'

  const views$ = getSource(viewList)
  const panelWidth$ = getSource(lastPayloadOfType(panelWidthChanged))

  const setPanelWidth = createDispatch(panelWidthChanged)

  const grabbingArea = node => {
    const nodeBounding = node.getBoundingClientRect()

    return {
      top: nodeBounding.top,
      left: Math.max(nodeBounding.left - 5, 0),
      right: Math.min(nodeBounding.left + 5, window.innerWidth),
      bottom: nodeBounding.bottom,
    }
  }

  const isInArea = (area, point) =>
    point.x > area.left &&
    point.x < area.right &&
    point.y > area.top &&
    point.y < area.bottom

  const withCursorPoint = callback => event => callback({
    x: event.clientX,
    y: event.clientY,
  })

  const resizeToCursor = (from, initialWidth, ranger) => to => {
    const deltaX = to.x - from.x
    setPanelWidth(ranger(initialWidth - deltaX))
  }

  const calls = (...callbacks) => arg => callbacks.map(callback => callback(arg))

  const ifInArea = getArea => callback => point => isInArea(getArea(), point) && callback(point)

  const createRanger = (min, max) => value => Math.min(Math.max(value, min), max)

  const minWidth = 450
  const maxWidthMargin = 30

  const handleMousedown = node => {
    const ifInGrabbingArea = ifInArea(() => grabbingArea(node))

    return withCursorPoint(ifInGrabbingArea(from => {
      const initialWidth = node.getBoundingClientRect().width
      const ranger = createRanger(
        minWidth,
        from.x + initialWidth - maxWidthMargin,
      )
      const resizeNode = withCursorPoint(resizeToCursor(from, initialWidth, ranger))

      document.documentElement.style.cursor = 'col-resize'

      const unsubscribeMousemove = subscribeEvent(document, 'mousemove', rafThrottle(resizeNode))
      const unsubscribeMouseup = subscribeEvent(document, 'mouseup', calls(
        resizeNode,
        event => {
          unsubscribeMouseup();
          unsubscribeMousemove();
          document.documentElement.style.cursor = null
        }
      ))
    }))
  }

  const resizeX = node => ({
    destroy: subscribeEvent(node, 'mousedown', handleMousedown(node))
  })
</script>

<style lang="scss">
  .coriolis-dev-tools {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 500px;
    background: rgb(85, 85, 85);
    color: rgb(235, 235, 227);
    padding: 3px 0 3px 6px;
    display: flex;
    flex-direction: column;
    z-index: 1;
    box-shadow: 12px 0px 20px 10px black;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -5px;
      bottom: 0;
      width: 10px;
      cursor: col-resize;
    }

    :global(> *) {
      flex: 1;
      overflow: auto;
    }

    header {
      flex: 0 0 auto;
      z-index: 1;
      overflow: hidden;

      .headerTop {
        margin: -3px 0 0 -6px;
        padding: 1px 10px 0 10px;
        background: rgba(white, .2);
      }

      :global(h2) {
        color: rgb(223, 223, 223);
        margin: 5px 0 0 20px;
        padding: 0;
        // text-align: center;
        font-size: 1.2em;
      }
    }

    nav {
      padding-top: 10px;
      margin-bottom: 10px;
    }

    :global(.nav-button) {
      cursor: pointer;
      margin: 1px 2px 0;
      padding: 4px 8px 0;
      background: rgba(white, .5);
      border-width: 1px 1px 0;
      border-style: solid;
      border-color: gray;
      border-radius: 8px 8px 0 0;

      &.coriolis-dev-tools-button-close {
        display: block;
        position: absolute;
        left: -41px;
        bottom: 35px;
        cursor: pointer;
        background-color: #bbb;
        transform: rotate(-90deg);
        font-size: .9em;
      }

      &[disabled] {
        border-width: 2px 1px 0;
        border-color: silver;
        cursor: default;
        background: #555;
        color: rgb(223, 223, 223);
        font-weight: bold;
      }
    }
  }
</style>

<div
  class="coriolis-dev-tools"
  use:resizeX
  style="width: {$panelWidth$ || 500}px"
>
  <header>
    <div class="headerTop">
      <slot name="title" />
      <nav>
        <NavButton
          view={false}
          projection={isDevtoolsOpen}
          buildEvent={devtoolsClosed}
          class="coriolis-dev-tools-button-close"
        >
          Close
        </NavButton>

        {#each $views$ as view (view)}
          <NavButton view={view.name}>{view.shortname || view.name}</NavButton>
        {/each}
      </nav>
    </div>
    <slot name="tools" />
  </header>
  <slot />
</div>
