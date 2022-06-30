// TODO(2fd): document de proper way to detect a mobile device
import { useEffect, useState } from 'react'

import once from '../utils/function/once'
import isMobile from '../utils/react/isMobile'

let IS_MOBILE: null | boolean = null
const detectMobile = once(() => isMobile())

export default function useMobileDetector(initialValue = false) {
  const [mobile, setMobile] = useState<boolean>(IS_MOBILE ?? initialValue)

  useEffect(() => {
    if (IS_MOBILE === null) {
      IS_MOBILE = detectMobile()
      if (mobile !== IS_MOBILE) {
        setMobile(IS_MOBILE)
      }
    }
  }, [])

  return mobile
}
