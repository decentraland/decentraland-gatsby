import { ChainId, getChainName } from '@dcl/schemas/dist/dapps/chain-id'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { connection } from 'decentraland-connect/dist/ConnectionManager'
import { Provider } from 'decentraland-connect/dist/types'
import { getChainConfiguration } from 'decentraland-dapps/dist/lib/chainConfiguration'
import { AddEthereumChainParameters } from 'decentraland-dapps/dist/modules/wallet/types'

import { Identity, identify } from '../utils/auth'
import { ownerAddress } from '../utils/auth/identify'
import { getCurrentIdentity, setCurrentIdentity } from '../utils/auth/storage'
import rollbar from '../utils/development/rollbar'
import segment from '../utils/development/segment'
import SingletonListener from '../utils/dom/SingletonListener'

export const chains = [
  ChainId.ETHEREUM_MAINNET,
  ChainId.ETHEREUM_ROPSTEN,
  ChainId.ETHEREUM_GOERLI,
  ChainId.ETHEREUM_KOVAN,
  ChainId.ETHEREUM_RINKEBY,
  ChainId.ETHEREUM_SEPOLIA,
  ChainId.MATIC_MAINNET,
  ChainId.MATIC_MUMBAI,
]

export enum AuthEvent {
  Connect = 'Connect',
  Connected = 'Connected',
  Disconnected = 'Disconnected',
}

export enum AuthStatus {
  Restoring,
  Disconnected,
  Connected,
  Connecting,
  Disconnecting,
}

export type AuthState = {
  selecting: boolean
  account: string | null
  identity: Identity | null
  provider: Provider | null
  providerType: ProviderType | null
  chainId: ChainId | null
  error: string | null
  status: AuthStatus
}

export const initialState: AuthState = Object.freeze({
  selecting: false,
  account: null,
  identity: null,
  provider: null,
  providerType: null,
  chainId: null,
  error: null,
  status: AuthStatus.Restoring,
})

let WINDOW_LISTENER: SingletonListener<Window> | null = null
export function getListener(): SingletonListener<Window> {
  if (!WINDOW_LISTENER) {
    WINDOW_LISTENER = SingletonListener.from(window)
  }

  return WINDOW_LISTENER!
}

export async function fetchAccounts(provider: Provider) {
  const currentAccounts = (await provider.request({
    method: 'eth_accounts',
  })) as string[]
  if (currentAccounts.length === 0) {
    throw new Error(`Provider is not connected`)
  }

  return currentAccounts.map((account) => account.toLowerCase())
}

export async function fetchChainId(provider: Provider) {
  const currentChainId = (await provider.request({
    method: 'eth_chainId',
  })) as string
  return parseInt(currentChainId, 16)
}

export async function restoreConnection(): Promise<AuthState> {
  try {
    const identity = getCurrentIdentity()
    const connectionData = connection.getConnectionData()

    // drop identity when connection data is missinig
    if (identity && !connectionData) {
      setCurrentIdentity(null)
    }

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

      const currentAccounts = await fetchAccounts(data.provider)
      if (currentAccounts[0] !== account) {
        throw new Error(`Account changed`)
      }

      const currentChainId = await fetchChainId(data.provider)

      return {
        account,
        provider,
        chainId: Number(currentChainId),
        providerType,
        identity,
        status: AuthStatus.Connected,
        selecting: false,
        error: null,
      }
    }
  } catch (err) {
    console.error(err)
    rollbar((rollbar) => rollbar.error(err))
    segment((analytics) =>
      analytics.track('error', {
        ...err,
        message: err.message,
        stack: err.stack,
      })
    )

    return {
      ...initialState,
      status: AuthStatus.Disconnected,
      error: err.message,
    }
  }

  return { ...initialState, status: AuthStatus.Disconnected }
}

export async function createConnection(
  providerType: ProviderType,
  chainId: ChainId
) {
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

      const currentAccounts = await fetchAccounts(data.provider)
      if (currentAccounts[0] !== account) {
        throw new Error(`Account changed`)
      }

      const currentChainId = await fetchChainId(data.provider)

      return {
        account,
        identity,
        chainId: Number(currentChainId),
        providerType,
        status: AuthStatus.Connected,
        provider: data.provider,
        selecting: false,
        error: null,
      }
    }
  } catch (err) {
    console.error(err)
    rollbar((rollbar) => rollbar.error(err))
    segment((analytics) =>
      analytics.track('error', {
        ...err,
        message: err.message,
        stack: err.stack,
      })
    )

    setCurrentIdentity(null)
    return {
      ...initialState,
      status: AuthStatus.Disconnected,
      error: err.message,
    }
  }

  return { ...initialState, status: AuthStatus.Disconnected }
}

export function isLoading(status: AuthStatus) {
  switch (status) {
    case AuthStatus.Connected:
    case AuthStatus.Disconnected:
      return false

    default:
      return true
  }
}

export async function switchToChainId(
  provider: Provider | null,
  chainId: ChainId
) {
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + chainId.toString(16) }],
      })
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [getAddEthereumChainParameters(chainId)],
          })

          const currentChainId = await fetchChainId(provider)
          if (currentChainId !== chainId) {
            throw new Error('chainId did not change after adding network')
          }
        } catch (addError) {
          throw new Error(`Error adding network: ${addError.message}`)
        }
      } else {
        throw new Error(`Error switching network: ${switchError.message}`)
      }
    }
  }
}

export function getAddEthereumChainParameters(
  chainId: ChainId
): AddEthereumChainParameters {
  const hexChainId = '0x' + chainId.toString(16)
  const chainName = getChainName(chainId)!
  const config = getChainConfiguration(chainId)
  switch (chainId) {
    case ChainId.MATIC_MAINNET:
      return {
        chainId: hexChainId,
        chainName,
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
        blockExplorerUrls: ['https://polygonscan.com/'],
      }
    case ChainId.MATIC_MUMBAI:
      return {
        chainId: hexChainId,
        chainName,
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      }
    case ChainId.ETHEREUM_MAINNET:
    case ChainId.ETHEREUM_ROPSTEN:
    case ChainId.ETHEREUM_RINKEBY:
    case ChainId.ETHEREUM_KOVAN:
    case ChainId.ETHEREUM_GOERLI:
    case ChainId.ETHEREUM_SEPOLIA:
      return {
        chainId: hexChainId,
        chainName,
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: [config.rpcURL],
        blockExplorerUrls: ['https://etherscan.io'],
      }
  }
}
