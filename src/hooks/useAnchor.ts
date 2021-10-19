import { useCallback, useEffect, useState } from 'react'

export default function useAnchor(href?: string | null) {
  const [anchor, setAnchor] = useState<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (href) {
      const a = document.createElement('a')
      a.target = '_blank'
      a.rel = 'noreferrer noopener'
      a.href = href
      setAnchor(a)
    }

    ;() => {
      if (anchor) {
        anchor.remove()
      }
    }
  }, [href])

  return useCallback(() => {
    anchor && anchor.click()
  }, [anchor])
}
