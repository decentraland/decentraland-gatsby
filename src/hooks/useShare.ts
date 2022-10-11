import { useCallback, useMemo, useState } from 'react'

import useTrackContext from '../context/Track/useTrackContext'
import { SegmentShare } from '../modules/segment'

export type DCLShareData = ShareData & {
  thumbnail?: string
}

export default function useShare() {
  const [data, setData] = useState<DCLShareData | null>(null)
  const track = useTrackContext()

  const share = useCallback((shareData: DCLShareData) => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!navigator.share) {
      track(SegmentShare.Share, { shareData })
      navigator.share(shareData)
    } else {
      track(SegmentShare.SharePopupOpen)
      setData(shareData)
    }
  }, [])
  const close = useCallback(() => {
    track(SegmentShare.SharePopupClose)
    setData(null)
  }, [setData])

  const shareState = useMemo(
    () => ({
      close,
      data,
    }),
    [close, data]
  )
  return [share, shareState] as const
}
