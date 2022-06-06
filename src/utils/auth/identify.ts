import '../buffer/buffer'
import { Web3Provider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'

import rollbar from '../development/rollbar'
import segment from '../development/segment'
import EmptyAccountsError from '../errors/EmptyAccountsError'
import once from '../function/once'

import type { AuthChain, AuthIdentity } from 'dcl-crypto/dist/types'
import type { ConnectionResponse } from 'decentraland-connect/dist/types'

const authenticator = once(() => import('dcl-crypto/dist/Authenticator'))

export default async function identify(connection: ConnectionResponse) {
  try {
    if (!connection.account) {
      throw new EmptyAccountsError()
    }

    const { Authenticator } = await authenticator()
    const address = connection.account!
    const provider = connection.provider
    const wallet = Wallet.createRandom()
    const expiration = 60 * 24 * 30
    const payload = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
    }

    // provider.
    const identity = await Authenticator.initializeAuthChain(
      address,
      payload,
      expiration,
      (message) => new Web3Provider(provider).getSigner().signMessage(message)
    )

    return identity
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
    return null
  }
}

export async function ownerAddress(authChain: AuthChain) {
  const { Authenticator } = await authenticator()
  return Authenticator.ownerAddress(authChain).toLowerCase()
}

export async function signPayload(identity: AuthIdentity, payload: string) {
  const { Authenticator } = await authenticator()
  return Authenticator.signPayload(identity, payload)
}
