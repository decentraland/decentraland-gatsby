import { useCallback, useMemo, useState } from 'react'

export type DCLShareData = ShareData & {
  thumbnail?: string
}

export default function useShare() {
  const [data, setData] = useState<DCLShareData | null>(null)

  const share = useCallback((shareData: DCLShareData) => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!navigator.share) {
      navigator.share(shareData)
    } else {
      setData(shareData)
    }
  }, [])
  const close = useCallback(() => setData(null), [setData])

  const shareState = useMemo(
    () => ({
      close,
      data,
    }),
    [close, data]
  )
  return [share, shareState] as const
}
