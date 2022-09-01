// TODO(#323): remove on v6
import { useCallback, useEffect, useState } from 'react'

import SingletonListener from '../utils/dom/SingletonListener'

let CURRENT_WIDTH = 767 as number

export interface ResponsiveWidthShorthand {
  minWidth?: number | string
  maxWidth?: number | string
}

/** @deprecated use decentraland-ui/dist/components/Media/Media */
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
  }, [width])

  return useCallback(
    function responsive(limits: Partial<ResponsiveWidthShorthand> = {}) {
      if (limits.minWidth !== undefined && width < limits.minWidth) {
        return false
      }

      if (limits.maxWidth !== undefined && width > limits.maxWidth) {
        return false
      }

      return true
    },
    [width]
  )
}
