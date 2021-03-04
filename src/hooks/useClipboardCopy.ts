import { useEffect, useState } from 'react'
import clipboardCopy from "clipboard-copy"

export default function useClipboardCopy(timeout?: number) {

  const [ state, setState ] = useState<string | number | boolean | null>(null)

  function copy(value: string | number | boolean | null) {
    clipboardCopy(String(value ?? ''))
    setState(value)
  }

  function clear() {
    setState(null)
  }

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
  }, [ state, timeout ])

  return [ state, { copy, clear } ] as const
}