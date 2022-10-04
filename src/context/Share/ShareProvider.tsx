import React, { createContext } from 'react'

import useShare from '../../hooks/useShare'

const defaultShareState: ReturnType<typeof useShare> = [
  () => {},
  { close: () => {}, data: null },
]

export const ShareContext = createContext(defaultShareState)
export default React.memo(function ShareProvider(
  props: React.PropsWithChildren<{}>
) {
  const share = useShare()

  return (
    <ShareContext.Provider value={share}>
      {props.children}
    </ShareContext.Provider>
  )
})
