import React, { createContext } from "react"
import useAuth from '../../hooks/useAuth'
import useTransaction from "../../hooks/useTransaction"

const defaultAuthState: ReturnType<typeof useAuth> = [
  null,
  {
    selecting: false,
    loading: true,
    chainId: null,
    providerType: null,
    provider: null,
    select: () => {},
    connect: () => {},
    disconnect: () => {}
  }
]

const defaultTransactionState: ReturnType<typeof useTransaction> = [
  null,
  {
    add: () => {},
    clear: () => {}
  }
]

export const AuthContext = createContext(defaultAuthState)
export const TransactionContext = createContext(defaultTransactionState)
export default React.memo(function AuthProvider(props: React.PropsWithChildren<{}>) {
  const auth = useAuth()
  const transactions = useTransaction(auth[0], auth[1].chainId)
  return <AuthContext.Provider value={auth}>
    <TransactionContext.Provider value={transactions}>
      {props.children}
    </TransactionContext.Provider>
  </AuthContext.Provider>
})