<script>
  import { isDevtoolsOpen } from '../../aggrs/isDevtoolsOpen'
  import { devtoolsOpened } from '../../events'

  import NavButton from './NavButton.svelte'
</script>

<style lang="scss">
  :global(.coriolis-dev-tools-button-open) {
    position: fixed;
    bottom: 24px;
    right: 48px;
    border-radius: 90% 10%;
    width: 130px;
    height: 40px;
    overflow: hidden;
    cursor: pointer;
    margin: 0;
    font-size: .8em;
    box-shadow: inset -3px -4px 10px -8px rgba(0,0,0,0.5);
    color: rgba(0, 0, 0, .6);

    &:hover {
      background-color: rgb(240, 246, 255);
    }
  }
</style>

<NavButton
  class="coriolis-dev-tools-button-open"
  view={true}
  aggr={isDevtoolsOpen}
  buildEvent={devtoolsOpened}
>
  Coriolis dev tools
</NavButton>
