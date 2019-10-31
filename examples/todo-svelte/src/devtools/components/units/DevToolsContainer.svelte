<script>
  import { getContext } from 'svelte'
  import { isDevtoolsOpen } from '../../aggrs/isDevtoolsOpen'
  import { devtoolsClosed } from '../../events'

  import NavButton from './NavButton.svelte'

  const views = getContext('views')
</script>

<style lang="scss">
  .coriolis-dev-tools {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 500px;
    background: rgb(85, 85, 85);
    color: rgb(235, 235, 227);
    padding: 3px 0 3px 6px;
    display: flex;
    flex-direction: column;
    z-index: 1;
    box-shadow: 12px 0px 20px 10px black;

    header {
      flex: 0 0 auto;
      z-index: 1;

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

    :global(> *) {
      flex: 1 1 auto;
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

<div class="coriolis-dev-tools">
  <header>
    <div class="headerTop">
      <slot name="title" />
      <nav>
        <NavButton
          view={false}
          aggr={isDevtoolsOpen}
          buildEvent={devtoolsClosed}
          class="coriolis-dev-tools-button-close"
        >
          Close
        </NavButton>

        {#each views as view (view)}
          <NavButton view={view.name}>{(views[view] && views[view].longname) || view.name}</NavButton>
        {/each}
      </nav>
    </div>
    <slot name="tools" />
  </header>
  <slot />
</div>
