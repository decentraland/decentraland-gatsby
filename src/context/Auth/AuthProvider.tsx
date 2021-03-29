import React, { createContext } from "react"
import useAuth from '../../hooks/useAuth'

const defaultState: ReturnType<typeof useAuth> = [
  null,
  {
    loading: true,
    chainId: null,
    providerType: null,
    provider: null,
    connect: () => {},
    disconnect: () => {}
  }
]

export const Context = createContext(defaultState)
export default React.memo(function AuthProvider(props: React.PropsWithChildren<{}>) {
  const auth = useAuth()
  return <Context.Provider value={auth}>{props.children}</Context.Provider>
})