import { useState, useEffect } from 'react'
import isMobile from '../utils/isMobile'

let IS_MOBILE = false

export default function useMobileDetector(initialValue: boolean = IS_MOBILE) {
  const [mobile, setMobile] = useState<boolean>(initialValue)

  useEffect(() => {
    const value = isMobile()
    if (value !== IS_MOBILE) {
      IS_MOBILE = value
      setMobile(isMobile())
    }
  }, [])

  return mobile
}