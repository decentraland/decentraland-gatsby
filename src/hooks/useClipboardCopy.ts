import { useState, useMemo } from 'react'
import clipboardCopy from "clipboard-copy"

// TODO v3: change return type
//  => [
//    values: string | null,
//    state: { coping: boolean, copy(newValue: string): void }
//  ]
export type ClipboardCopyState = {
  value: string | null,
  loading: boolean,
}

type InnerState = ClipboardCopyState & { timeout: ReturnType<typeof setTimeout> | null }

export default function useClipboardCopy(loadingTime: number = 1000) {

  const [ inner, setInner ] = useState<InnerState>({
    timeout: null,
    value: null,
    loading: false
  })

  const state = useMemo<ClipboardCopyState>(
    () => ({ value: inner.value, loading: inner.loading }),
    [ inner.value, inner.loading ]
  )

  function copy(value: string) {
    clipboardCopy(value)
    if (inner.timeout) {
      clearTimeout(inner.timeout)
    }

    const timeout = setTimeout(() => setInner((current) => ({
      ...current,
      timeout: null,
      loading: false
    })), loadingTime)

    setInner({
      loading: true,
      value,
      timeout
    })
  }

  return [ state, copy ] as const
}