import { AuthLinkType } from 'dcl-crypto/dist/types'
import SingletonListener from '../dom/SingletonListener'
import { Identity } from './types'
import Time from '../date/Time'
import { PersistedKeys } from '../loader/types'

const STORE_LEGACY_KEY = 'auth'
let CURRENT_IDENTITY: Identity | null = null
let CURRENT_IDENTITY_RAW: string | null = null
let STORAGE_LISTENER: SingletonListener<Window> | null = null

function getStorateListener() {
  if (STORAGE_LISTENER === null) {
    CURRENT_IDENTITY = restoreIdentity()
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

export function setCurrentIdentity(identity: Identity | null) {
  if (identity === null || isExpired(identity) || !isValid(identity)) {
    CURRENT_IDENTITY = null
    storeIdentity(null)
    return null
  }

  CURRENT_IDENTITY = identity
  storeIdentity(identity)
  return identity
}

export function getCurrentIdentity() {
  getStorateListener()
  return CURRENT_IDENTITY
}

function storeIdentity(identity: Identity | null) {
  localStorage.removeItem(STORE_LEGACY_KEY)

  if (identity === null) {
    CURRENT_IDENTITY_RAW = null
    localStorage.removeItem(PersistedKeys.Identity)
  } else {
    CURRENT_IDENTITY_RAW = JSON.stringify(identity)
    localStorage.setItem(PersistedKeys.Identity, CURRENT_IDENTITY_RAW)
  }

  // local propagation
  Promise.resolve().then(() => {
    getStorateListener().dispatch(PersistedKeys.Identity as any, identity)
  })
}

function restoreIdentity(): Identity | null {
  const raw = localStorage.getItem(PersistedKeys.Identity)

  if (!raw || raw === 'null') {
    CURRENT_IDENTITY_RAW = null
    return null
  }

  if (CURRENT_IDENTITY_RAW === raw) {
    return CURRENT_IDENTITY
  }

  try {
    const identity = JSON.parse(raw)

    if (identity && (isExpired(identity) || !isValid(identity))) {
      localStorage.removeItem(PersistedKeys.Identity)
      CURRENT_IDENTITY_RAW = null
      return null
    }

    CURRENT_IDENTITY_RAW = raw
    return identity
  } catch (err) {
    CURRENT_IDENTITY_RAW = null
    return null
  }
}
