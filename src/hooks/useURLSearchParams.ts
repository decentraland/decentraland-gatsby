import { useLocation } from '@gatsbyjs/reach-router'
import { useMemo } from 'react'

export default function useURLSearchParams() {
  const location = useLocation()
  return useMemo(() => new URLSearchParams(location.search), [location.search])
}
