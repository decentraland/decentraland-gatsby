import React, { createContext } from 'react'

import useAuth from '../../hooks/useAuth'
import useTransaction from '../../hooks/useTransaction'
import { AuthOptions } from '../../hooks/useAuth.utils'

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
export default React.memo(function AuthProvider(
  props: React.PropsWithChildren<AuthOptions>
) {
  const auth = useAuth(props)
  const transactions = useTransaction(auth[0], auth[1].chainId)
  return (
    <AuthContext.Provider value={auth}>
      <TransactionContext.Provider value={transactions}>
        {props.children}
      </TransactionContext.Provider>
    </AuthContext.Provider>
  )
})
