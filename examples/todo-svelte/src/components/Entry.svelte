<script>
  import { setStoreAPI } from './provideStore'

  const { Root, dispatch, withProjection, ...props } = $$props

  setStoreAPI({ dispatch, withProjection })
</script>

<svelte:component this={Root} {...props} />
