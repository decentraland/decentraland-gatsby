// TODO(#323): remove on v6
import { useMemo } from 'react'

import { useLocation } from '@gatsbyjs/reach-router'

/** @deprecated use @gatsbyjs/reach-router */
export default function useURLSearchParams() {
  const location = useLocation()
  return useMemo(() => new URLSearchParams(location.search), [location.search])
}
