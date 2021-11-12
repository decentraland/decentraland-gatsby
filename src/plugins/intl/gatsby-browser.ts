import './utils'
import WrapPageElement from './WrapPageElement'

export const onRouteUpdate = () => {
  window.___decentralandNavigationUpdates =
    window.___decentralandNavigationUpdates === undefined
      ? 0
      : window.___decentralandNavigationUpdates + 1
}

export const wrapPageElement = WrapPageElement
