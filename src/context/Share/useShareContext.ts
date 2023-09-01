import { useContext } from 'react'

import { ShareContext } from './ShareProvider'

export default function useShareContext() {
  return useContext(ShareContext)
}
