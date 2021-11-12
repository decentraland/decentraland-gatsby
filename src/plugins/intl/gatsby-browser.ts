export { default as wrapPageElement } from './wrapPageElement'
import './utils'

export const onRouteUpdate = () => {
  window.___decentralandNavigationUpdates =
    window.___decentralandNavigationUpdates === undefined
      ? 0
      : window.___decentralandNavigationUpdates + 1
}
