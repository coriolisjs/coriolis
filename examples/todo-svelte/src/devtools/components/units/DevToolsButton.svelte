<script>
  import { isDevtoolsOpen } from '../../aggrs/isDevtoolsOpen'
  import { devtoolsOpened } from '../../events'

  import NavButton from '../units/NavButton.svelte'
</script>

<style>
  :global(.coriolis-dev-tools-button-open) {
    position: fixed;
    bottom: 24px;
    right: 48px;
    border-radius: 100%;
    width: 56px;
    height: 56px;
    overflow: hidden;
    cursor: pointer;
  }
</style>

<NavButton
  class="coriolis-dev-tools-button-open"
  view={true}
  aggr={isDevtoolsOpen}
  buildEvent={devtoolsOpened}
>
  Open Coriolis dev tools
</NavButton>
