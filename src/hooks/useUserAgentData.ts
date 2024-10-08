// TODO(2fd): add Docs, set as good practice
import { useEffect, useMemo, useState } from 'react'

import { UAParser } from 'ua-parser-js'
// @ts-expect-error: missing types
// eslint-disable-next-line import/no-unresolved
import { isAppleSilicon } from 'ua-parser-js/helpers'

import once from '../utils/function/once'
import isMobile from '../utils/react/isMobile'

export type NavigatorUAData = {
  brands: Brand[]
  mobile: boolean
  platform: string
  cpu: string
}

export type Brand = {
  brand: string
  version: string
}

const defaultGlobalValue: NavigatorUAData = {
  brands: [],
  mobile: false,
  platform: 'Unknown',
  cpu: 'Unknown',
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

    let architecture
    if (!ua.cpu.architecture) {
      architecture =
        ua.os.name === 'Mac OS' && isAppleSilicon(ua) ? 'arm64' : 'Unknown'
    } else {
      architecture = ua.cpu.architecture
    }

    return {
      platform: ua.os.name ?? defaultGlobalValue.platform,
      cpu: architecture,
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
