import { useEffect, useState } from 'react'
import { ChainId } from '@dcl/schemas'
import { Provider, ProviderType } from 'decentraland-connect/dist/types'
import { connection } from 'decentraland-connect/dist/ConnectionManager'
import { getCurrentIdentity, setCurrentIdentity } from '../utils/auth/storage'
import segment from '../utils/development/segment'
import rollbar from '../utils/development/rollbar'
import { identify, Identity } from '../utils/auth'
import { PersistedKeys } from '../utils/loader/types'
import SingletonListener from '../utils/dom/SingletonListener'
import { ownerAddress } from '../utils/auth/identify'

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
  selecting: boolean
  account: string | null
  identity: Identity | null
  provider: Provider | null
  providerType: ProviderType | null
  chainId: ChainId | null
  status: AuthStatus
}

export const initialState: AuthState = Object.freeze({
  selecting: false,
  account: null,
  identity: null,
  provider: null,
  providerType: null,
  chainId: null,
  status: AuthStatus.Restoring,
})

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
    // if (!identity && connectionData) {
    //   await connection.disconnect().catch((err) => {
    //     console.error(err)
    //     rollbar((rollbar) => rollbar.error(err))
    //   })
    // }

    if (identity && connectionData) {
      const data = await connection.connect(
        connectionData.providerType,
        connectionData.chainId
      )

      // const previousConnection = await connection.tryPreviousConnection()
      const provider = data.provider

      if (!provider) {
        throw new Error(`Error getting provider`)
      }

      const account = await ownerAddress(identity!.authChain)
      const providerType = connectionData!.providerType
      const chainId = connectionData!.chainId

      return {
        account,
        provider,
        chainId,
        providerType,
        identity,
        status: AuthStatus.Connected,
        selecting: false,
      }
    }
  } catch (err) {
    console.error(err)
    rollbar((rollbar) => rollbar.error(err))
  }

  return { ...initialState, status: AuthStatus.Disconnected }
}

async function createConnection(providerType: ProviderType, chainId: ChainId) {
  try {
    connection.getConnectionData()
    const data = await connection.connect(providerType, chainId)
    const identity = await identify(data)

    if (identity && identity.authChain) {
      const account = await ownerAddress(identity.authChain)
      // const previousConnection = await connection.tryPreviousConnection()
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
        selecting: false,
      }
    }
  } catch (err) {
    console.error(err)
    rollbar((rollbar) => rollbar.error(err))
  }

  setCurrentIdentity(null)
  return { ...initialState, status: AuthStatus.Disconnected }
}

function isLoading(status: AuthStatus) {
  switch (status) {
    case AuthStatus.Connected:
    case AuthStatus.Disconnected:
      return false

    default:
      return true
  }
}

export default function useAuth() {
  const [state, setState] = useState<AuthState>({ ...initialState })

  function select(selecting: boolean = true) {
    if (isLoading(state.status)) {
      return
    }

    if (selecting === state.selecting) {
      return
    }

    setState((current) => ({ ...current, selecting }))
  }

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
      rollbar((rollbar) => rollbar.error(`Invalid connection params: ${JSON.stringify(conn)}`))
      return
    }

    segment((analytics, context) => analytics.track(AuthEvent.Connect, { ...context, ...conn }))
    setState({
      account: null,
      identity: null,
      provider: null,
      selecting: state.selecting,
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
      selecting: false,
      providerType: null,
      chainId: null,
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
              selecting: false,
              account: null,
              identity: null,
              provider: null,
              providerType: null,
              chainId: null,
            }
          }

          return {
            status: AuthStatus.Disconnecting,
            selecting: false,
            account: null,
            identity: null,
            provider: null,
            providerType: null,
            chainId: null,
          }
        })
      }
    }

    getListener().addEventListener(PersistedKeys.Identity as any, updateIdetity)
    return () => {
      cancelled = true
      getListener().removeEventListener(
        PersistedKeys.Identity as any,
        updateIdetity
      )
    }
  }, [])

  // connect or disconnect
  useEffect(() => {
    let cancelled = false
    if (state.status === AuthStatus.Restoring) {
      CONNECTION_PROMISE = restoreConnection()
      Promise.resolve(CONNECTION_PROMISE).then((result) => {
        if (!cancelled) {
          setState(result)
        }
      })
    }

    // connect
    if (
      state.status === AuthStatus.Connecting &&
      state.providerType &&
      state.chainId
    ) {
      CONNECTION_PROMISE = createConnection(state.providerType, state.chainId)
      Promise.resolve(CONNECTION_PROMISE).then((result) => {
        if (!cancelled) {
          if (result.status === AuthStatus.Connected) {
            const conn = {
              account: result.account,
              providerType: state.providerType,
              chainId: state.chainId,
            }

            segment((analytics, context) => {
              analytics.identify(conn.account!)
              analytics.track(AuthEvent.Connected, { ...context, ...conn })
            })

            rollbar((rollbar) => {
              rollbar.configure({
                payload: {
                  person: {
                    id: conn.account!
                  }
                }
              })
            })
          } else {
            result.selecting = state.selecting
          }

          setState(result)
        }
      })
    }

    // disconnect
    if (
      state.status === AuthStatus.Disconnecting &&
      state.providerType === null &&
      state.chainId === null
    ) {
      setCurrentIdentity(null)
      connection.disconnect().catch((err) => {
        console.error(err)
        rollbar((rollbar) => rollbar.error(err))
      })
      segment((analytics, context) => analytics.track(AuthEvent.Disconnected, context))
      rollbar((rollbar) => rollbar.configure({ payload: { person: { id: null } } }))
      setState({
        ...initialState,
        status: AuthStatus.Disconnected,
      })
    }

    return () => {
      cancelled = true
    }
  }, [state.status, state.providerType, state.chainId])

  const loading = isLoading(state.status)
  return [
    state.account,
    {
      connect,
      disconnect,
      select,
      loading,
      selecting: state.selecting,
      provider: !loading ? state.provider : null,
      providerType: !loading ? state.providerType : null,
      chainId: !loading ? state.chainId : null,
    },
  ] as const
}
