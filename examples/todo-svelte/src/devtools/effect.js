import { createUI } from './effects/ui'
import { createNav } from './effects/nav'

export const createCoriolisDevToolsEffect = () => ({ addEffect }) => {
  const removeUI = addEffect(createUI())
  const removeNav = addEffect(createNav(['EventsList']))

  return () => {
    removeUI()
    removeNav()
  }
}
