import Responsive, {
  ResponsiveWidthShorthand,
} from 'semantic-ui-react/dist/commonjs/addons/Responsive'
import { useState, useEffect } from 'react'
import SingletonListener from '../utils/dom/SingletonListener'

let CURRENT_WIDTH = Responsive.onlyMobile.maxWidth as number

export default function useResponsive() {
  const [width, setWidth] = useState(CURRENT_WIDTH)

  useEffect(() => {
    function updateWidth() {
      const currentWidth = window.innerWidth

      if (CURRENT_WIDTH !== currentWidth) {
        CURRENT_WIDTH = currentWidth
      }

      if (width !== currentWidth) {
        setWidth(currentWidth)
      }
    }

    updateWidth()

    const listener = SingletonListener.from(window)
    listener.addEventListener('resize', updateWidth)
    return () => {
      listener.removeEventListener('resize', updateWidth)
    }
  }, [])

  return function responsive(limits: Partial<ResponsiveWidthShorthand> = {}) {
    if (limits.minWidth !== undefined && width < limits.minWidth) {
      return false
    }

    if (limits.maxWidth !== undefined && width > limits.maxWidth) {
      return false
    }

    return true
  }
}
