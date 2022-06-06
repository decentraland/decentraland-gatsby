import { useContext } from 'react'

import { AuthContext } from './AuthProvider'

export default function useAuthContext() {
  return useContext(AuthContext)
}
