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
    color: beige;
    padding: 3px 0 3px 6px;
    display: flex;
    flex-direction: column;
    z-index: 0;

    header {
      flex: 0 0 auto;
      z-index: 1;
    }

    :global(> *) {
      flex: 1 1 auto;
    }

    :global(.coriolis-dev-tools-button-close) {
      display: block;
      position: absolute;
      left: -28px;
      bottom: 24px;
      width: 56px;
      height: 56px;
      overflow: hidden;
      border-radius: 100%;
    }
  }
</style>

<div class="coriolis-dev-tools">
  <header class="head">
    <nav>
      <NavButton view={false} aggr={isDevtoolsOpen} buildEvent={devtoolsClosed} class="coriolis-dev-tools-button-close">Close Coriolis dev tools</NavButton>

      {#each views as view (view)}
        <NavButton view={view.name}>{(views[view] && views[view].longname) || view.name}</NavButton>
      {/each}
    </nav>
    <slot name="title" />
  </header>
  <slot />
</div>
