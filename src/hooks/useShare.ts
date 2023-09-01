import { useCallback, useMemo, useState } from 'react'

import useTrackContext from '../context/Track/useTrackContext'
import { ShareEvent } from './useShare.utils'

export type DCLShareData = ShareData & {
  thumbnail?: string
}

export default function useShare() {
  const [data, setData] = useState<DCLShareData | null>(null)
  const track = useTrackContext()

  const share = useCallback((shareData: DCLShareData) => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!navigator.share) {
      track(ShareEvent.Share, { shareData })
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
