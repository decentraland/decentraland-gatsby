import { useContext } from 'react'
import { Context } from './AuthProvider'

export default function useAuthContext() {
  return useContext(Context)
}
