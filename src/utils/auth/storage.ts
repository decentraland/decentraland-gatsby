import { AuthLinkType } from '@dcl/crypto/dist/types'
import * as SSO from '@dcl/single-sign-on-client'

import Time from '../date/Time'
import SingletonListener from '../dom/SingletonListener'
import { PersistedKeys } from '../loader/types'
import { Identity } from './types'
import { ownerAddress } from './identify'

const STORE_LEGACY_KEY = 'auth'
let CURRENT_IDENTITY: Identity | null = null
let CURRENT_IDENTITY_RAW: string | null = null
let STORAGE_LISTENER: SingletonListener<Window> | null = null

function getStorageListener() {
  if (STORAGE_LISTENER === null) {
    STORAGE_LISTENER = SingletonListener.from(window)
    // TODO: fix inter operativity with formatic
    // STORAGE_LISTENER.addEventListener('storage', (event) => {
    //   if (event.key !== PersistedKeys.Identity) {
    //     return
    //   }
    //   CURRENT_IDENTITY = restoreIdentity()
    //   // domain propagation
    //   Promise.resolve().then(() => {
    //     getStorateListener().dispatch(PersistedKeys.Identity as any, CURRENT_IDENTITY)
    //   })
    // })
  }

  return STORAGE_LISTENER!
}

export function isExpired(identity?: Identity) {
  if (!identity) {
    return true
  }

  return Time.date(identity.expiration).getTime() < Date.now()
}

export function isValid(identity?: Identity) {
  if (!identity) {
    return false
  }

  const link = identity.authChain.find(
    (link) =>
      link.type === AuthLinkType.ECDSA_PERSONAL_EPHEMERAL ||
      link.type === AuthLinkType.ECDSA_EIP_1654_EPHEMERAL
  )

  if (link && link.signature && typeof link.signature === 'string') {
    return true
  }

  return false
}

export async function setCurrentIdentity(identity: Identity | null) {
  if (identity === null || isExpired(identity) || !isValid(identity)) {
    CURRENT_IDENTITY = null
    await storeIdentity(null)
    return null
  }

  CURRENT_IDENTITY = identity
  await storeIdentity(identity)
  return identity
}

export function getCurrentIdentity() {
  getStorageListener()
  return CURRENT_IDENTITY
}

async function storeIdentity(identity: Identity | null) {
  if (typeof localStorage !== 'undefined') {
    // Removes the identity from legacy storage.
    localStorage.removeItem(STORE_LEGACY_KEY)
    localStorage.removeItem(PersistedKeys.Identity)

    if (identity) {
      // If an identity is provided, store it in the SSO iframe for the account it belongs to.
      const account = await ownerAddress(identity.authChain)
      await SSO.storeIdentity(account, identity)
      CURRENT_IDENTITY_RAW = JSON.stringify(identity)
    } else {
      // If no identity is provided, clear the previous one if any.
      if (CURRENT_IDENTITY_RAW) {
        const prevIdentity = JSON.parse(CURRENT_IDENTITY_RAW)
        const account = await ownerAddress(prevIdentity.authChain)
        await SSO.clearIdentity(account)
      }

      CURRENT_IDENTITY_RAW = null
    }

    // local propagation
    Promise.resolve().then(() => {
      getStorageListener().dispatch(PersistedKeys.Identity as any, identity)
    })
  }
}
