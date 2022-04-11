<script>
  import AppContainer from '../units/AppContainer.svelte'
  import TodoControl from '../units/TodoControl.svelte'
  import TodoList from '../units/TodoList.svelte'
  import ViewLink from '../units/ViewLink.svelte'
</script>

<style>
  :global(.todolist) {
    max-height: 60vh;
    overflow: auto;
    width: 60vw;
    margin: 1em auto;
    background: #f9f9f9;
    padding: 1em;
  }
</style>

<AppContainer>
  <h1>Ma liste de tâches</h1>
  <TodoControl />
  <TodoList class="todolist" />
  <ViewLink view="About">
    About
  </ViewLink>
</AppContainer>
