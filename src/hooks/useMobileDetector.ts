import { useState, useEffect } from 'react'
import isMobile from '../utils/isMobile'

let IS_MOBILE: boolean | null = null

export default function useMobileDetector(
  initialValue: boolean = IS_MOBILE ?? false
) {
  const [mobile, setMobile] = useState<boolean>(initialValue)

  useEffect(() => {
    if (IS_MOBILE === null) {
      IS_MOBILE = isMobile()

      if (IS_MOBILE !== mobile) {
        setMobile(IS_MOBILE)
      }
    }
  }, [])

  return mobile
}
