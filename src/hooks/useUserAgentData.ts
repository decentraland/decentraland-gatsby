import { useEffect, useMemo, useState } from 'react'

import { UAParser } from 'ua-parser-js'

import once from '../utils/function/once'
import isMobile from '../utils/react/isMobile'

export type NavigatorUAData = {
  brands: Brand[]
  mobile: boolean
  platform: string
}

export type Brand = {
  brand: string
  version: string
}

const defaultGlobalValue: NavigatorUAData = {
  brands: [],
  mobile: false,
  platform: 'Unknown',
}

const getUserAgentData = once((): NavigatorUAData => {
  if ((navigator as any).userAgentData) {
    return (navigator as any).userAgentData
  }

  if (navigator.userAgent) {
    const ua = UAParser(navigator.userAgent)
    const brands: Brand[] = []
    if (ua.engine.name && ua.engine.version) {
      brands.push({
        brand: ua.engine.name,
        version: ua.engine.version,
      })
    }

    if (ua.browser.name && ua.browser.version) {
      brands.push({
        brand: ua.browser.name,
        version: ua.browser.version,
      })
    }

    return {
      platform: ua.os.name ?? defaultGlobalValue.platform,
      mobile: isMobile(),
      brands,
    }
  }

  return defaultGlobalValue
})

/**
 * extract or infer the [UserAgentData](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData)
 * that is an object which can be used to access the User-Agent Client Hints API.
 */
export default function useUserAgentData(
  initialValue: Partial<Pick<NavigatorUAData, 'mobile' | 'platform'>> = {}
): NavigatorUAData {
  const defaultValue = useMemo<NavigatorUAData>(
    () => ({ ...defaultGlobalValue, ...initialValue }),
    [initialValue.mobile, initialValue.platform]
  )

  const [data, setData] = useState<NavigatorUAData>(defaultValue)
  useEffect(() => setData(getUserAgentData()), [])

  return data
}
