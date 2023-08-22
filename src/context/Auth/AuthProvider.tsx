import React, { createContext, useEffect } from 'react'

import * as SSO from '@dcl/single-sign-on-client'

import useAuth from '../../hooks/useAuth'
import useTransaction from '../../hooks/useTransaction'
import { AuthProviderProps } from './utils'

const defaultAuthState: ReturnType<typeof useAuth> = [
  null,
  {
    selecting: false,
    loading: true,
    chainId: null,
    providerType: null,
    provider: null,
    error: null,
    switchTo: () => {},
    select: () => {},
    connect: () => {},
    disconnect: () => {},
  },
]

const defaultTransactionState: ReturnType<typeof useTransaction> = [
  [],
  {
    add: () => {},
    clear: () => {},
  },
]

export const AuthContext = createContext(defaultAuthState)
export const TransactionContext = createContext(defaultTransactionState)
export default React.memo(function AuthProvider({
  sso,
  children,
}: React.PropsWithChildren<AuthProviderProps>) {
  const auth = useAuth()
  const transactions = useTransaction(auth[0], auth[1].chainId)

  // Initialize SSO
  // Will only be initialized if the sso url is provided.
  // If the url is not provided, the identity of the user will be stored in the application's local storage instead of the sso local storage.
  useEffect(() => {
    if (sso) {
      SSO.init(sso)
    }
  }, [])

  return (
    <AuthContext.Provider value={auth}>
      <TransactionContext.Provider value={transactions}>
        {children}
      </TransactionContext.Provider>
    </AuthContext.Provider>
  )
})
