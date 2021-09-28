import { useCallback, useEffect, useMemo, useState } from 'react'
import clipboardCopy from 'clipboard-copy'

export default function useClipboardCopy(timeout?: number) {
  const [state, setState] = useState<string | number | boolean | null>(null)

  const copy = useCallback(
    (value: string | number | boolean | null) => {
      clipboardCopy(String(value ?? ''))
      setState(value)
    },
    [state]
  )

  const clear = useCallback(() => setState(null), [state])

  useEffect(() => {
    let copyTimeout: null | ReturnType<typeof setTimeout> = null
    if (state && timeout && timeout > 0) {
      copyTimeout = setTimeout(() => clear(), timeout)
    }

    return () => {
      if (copyTimeout) {
        clearTimeout(copyTimeout)
      }
    }
  }, [state, timeout])

  const actions = useMemo(() => ({ copy, clear }), [copy, clear])

  return [state, actions] as const
}
