// TODO(2fd): remove on v6, better be explicit on this
import { useMemo } from 'react'

import { useLocation } from '@gatsbyjs/reach-router'

export default function useURLSearchParams() {
  const location = useLocation()
  return useMemo(() => new URLSearchParams(location.search), [location.search])
}
