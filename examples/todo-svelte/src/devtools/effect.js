import { createUI } from './effects/ui'
import { createNav } from './effects/nav'

import { viewNames } from './components/views'

export const createCoriolisDevToolsEffect = () => ({ addEffect }) => {
  const removeUI = addEffect(createUI())
  const removeNav = addEffect(createNav(viewNames))

  return () => {
    removeUI()
    removeNav()
  }
}
