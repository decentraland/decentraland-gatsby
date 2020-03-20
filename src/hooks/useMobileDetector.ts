import { useState, useEffect } from 'react'
import isMobile from '../utils/isMobile'

export default function useMobileDetector(initialValue: boolean = false) {
  const [mobile, setMobile] = useState<boolean>(initialValue)

  useEffect(() => {
    setMobile(isMobile())
  }, [])

  return mobile
}