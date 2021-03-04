import { useEffect, useState } from "react"
import { Provider, ProviderType, ChainId } from "decentraland-connect/dist/types"
import { connection } from "decentraland-connect/dist/ConnectionManager"
import { getCurrentIdentity, setCurrentIdentity } from "../utils/auth/storage"
import segment from "../utils/segment/segment"
import { identify, Identity } from "../utils/auth"
import { PersistedKeys } from "../utils/loader/types"
import SingletonListener from "../utils/dom/SingletonListener"
import { ownerAddress } from "../utils/auth/identify"

enum AuthEvent {
  Connect = 'Connect',
  Connected = 'Connected',
  Disconnected = 'Disconnected',
}

enum AuthStatus {
  Restoring,
  Disconnected,
  Connected,
  Connecting,
  Disconnecting,
}

type AuthState = {
  account: string | null,
  identity: Identity | null,
  provider: Provider | null,
  providerType: ProviderType | null,
  chainId: ChainId | null,
  status: AuthStatus,
}

const initialState: AuthState = {
  account: null,
  identity: null,
  provider: null,
  providerType: null,
  chainId: null,
  status: AuthStatus.Restoring,
}

let WINDOW_LISTENER: SingletonListener<Window> | null = null
function getListener(): SingletonListener<Window> {
  if (!WINDOW_LISTENER) {
    WINDOW_LISTENER = SingletonListener.from(window)
  }

  return WINDOW_LISTENER!
}

let CONNECTION_PROMISE: Promise<AuthState> | null = null
async function restoreConnection(): Promise<AuthState> {
  try {
    const identity = getCurrentIdentity()
    const connectionData = connection.getConnectionData()

    // drop identity when connection data is missinig
    if (identity && !connectionData) {
      setCurrentIdentity(null)
    }

    // drop connection when identity is missing
    if (!identity && connectionData) {
      await connection.disconnect()
        .catch(err => console.error(err))
    }

    if (identity && connectionData) {
      if (!connection.connector) {
        await connection.tryPreviousConnection()
      }

      const account = await ownerAddress(identity!.authChain)
      const provider = await connection.connector!.getProvider()
      const providerType = connectionData!.providerType
      const chainId = connectionData!.chainId

      return {
        account,
        provider,
        chainId,
        providerType,
        identity,
        status: AuthStatus.Connected
      }
    }
  } catch (err) {
    console.error(err)
  }

  return { ...initialState, status: AuthStatus.Disconnected }
}

async function createConnection(providerType: ProviderType, chainId: ChainId) {
  try {
    const data = await connection.connect(providerType, chainId)
    const identity = await identify(data)
    if (identity && identity.authChain) {
      const account = await ownerAddress(identity.authChain)
      Promise.resolve().then(() => {
        setCurrentIdentity(identity)
      })
      return {
        account,
        identity,
        chainId,
        providerType,
        status: AuthStatus.Connected,
        provider: data.provider,
      }
    }
  } catch (err) {
    console.error(err)
  }

  setCurrentIdentity(null)
  return { ...initialState, status: AuthStatus.Disconnected }
}

function isLoading(status: AuthStatus) {
  switch(status) {
    case AuthStatus.Connected:
    case AuthStatus.Disconnected:
      return false

    default:
      return true
  }
}

export default function useAuth() {
  const [ state, setState ] = useState<AuthState>({ ...initialState })

  function connect(providerType: ProviderType, chainId: ChainId) {
    if (isLoading(state.status)) {
      return
    }

    if (state.account) {
      console.warn(`Already connected as "${state.account}"`)
      return
    }

    const conn = { providerType: providerType, chainId: chainId }
    if (!providerType || !chainId) {
      console.error(`Invalid connection params: ${JSON.stringify(conn)}`)
      return
    }

    segment((analytics) => analytics.track(AuthEvent.Connect, conn))

    setState({
      account: null,
      identity: null,
      provider: null,
      status: AuthStatus.Connecting,
      providerType,
      chainId,
    })
  }

  function disconnect() {
    if (isLoading(state.status)) {
      return
    }

    if (!state.account) {
      return
    }

    setState({
      status: AuthStatus.Disconnecting,
      account: null,
      identity: null,
      provider: null,
      providerType: null,
      chainId: null
    })
  }

  // bootstrap
  useEffect(() => {
    let cancelled = false
    function updateIdetity(newIdentity: Identity | null) {
      if (!cancelled) {
        setState((currentState) => {
          if (currentState.identity === newIdentity) {
            return currentState
          }

          if (newIdentity) {
            return {
              status: AuthStatus.Restoring,
              account: null,
              identity: null,
              provider: null,
              providerType: null,
              chainId: null
            }
          }

          return {
            status: AuthStatus.Disconnecting,
            account: null,
            identity: null,
            provider: null,
            providerType: null,
            chainId: null
          }
        })
      }
    }

    getListener().addEventListener(PersistedKeys.Identity as any, updateIdetity)
    return () => {
      cancelled = true
      getListener().removeEventListener(PersistedKeys.Identity as any, updateIdetity)
    }
  }, [])

  // connect or disconnect
  useEffect(() => {
    let cancelled = false
    if (state.status === AuthStatus.Restoring) {
      CONNECTION_PROMISE = restoreConnection()
      Promise.resolve(CONNECTION_PROMISE)
        .then((result) => {
          if (!cancelled) {
            setState(result)
          }
        })
    }

    // connect
    if (state.status === AuthStatus.Connecting && state.providerType && state.chainId) {
      CONNECTION_PROMISE = createConnection(state.providerType, state.chainId)
      Promise.resolve(CONNECTION_PROMISE)
        .then((result) => {
          if (!cancelled) {
            if (result.status === AuthStatus.Connected) {
              const conn = {
                account: result.account,
                providerType: state.providerType,
                chainId: state.chainId,
              }

              segment((analytics) => {
                analytics.identify(conn.account!)
                analytics.track(AuthEvent.Connected, conn)
              })
            }
            setState(result)
          }
        })
    }

    // disconnect
    if (state.status === AuthStatus.Disconnecting && state.providerType === null && state.chainId === null) {
      setCurrentIdentity(null)
      connection.disconnect().catch((err) => console.error(err))
      segment((analytics) => analytics.track(AuthEvent.Disconnected, {}))
      setState({
        ...initialState,
        status: AuthStatus.Disconnected
      })
    }

    return () => {
      cancelled = true
    }

  }, [ state.status, state.providerType, state.chainId ])

  const loading = isLoading(state.status)
  return [
    state.account,
    {
      connect,
      disconnect,
      loading,
      provider: !loading ? state.provider: null,
      providerType: !loading ? state.providerType: null,
      chainId: !loading ? state.chainId: null,
    }
  ] as const
}
