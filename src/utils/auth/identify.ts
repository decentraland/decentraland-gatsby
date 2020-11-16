import { Address } from 'web3x/address';
import { Account } from 'web3x/account';
import { Personal } from 'web3x/personal';
import { bufferToHex } from 'web3x/utils';
import { Profile, ProfileChangeEvent, ProfileExpiredEvent, ProfileEffectHandle } from './types';
import getEth from './getEth';
import getCurrentAddress from './getCurrentAddress';
import Katalyst from '../api/Katalyst';
import SingletonListener from '../SingletonListener';
import track from '../../components/Segment/track';

const dependency = import('dcl-crypto/dist/Authenticator')

export const STORE_PROFILE_KEY = 'auth'
let CURRENT_PROFILE: Profile | null = null
let STORE_LISTENER: SingletonListener<Window> | null = null
let PROFILE_LISTENER: SingletonListener<any> | null = null
let LOCAl_CHANGE = false
let EXPIRATION_TIMEOUT: any = null

export default async function identify() {
  if (CURRENT_PROFILE && !isExpired(CURRENT_PROFILE)) {
    return CURRENT_PROFILE;
  }

  try {
    const eth = await getEth();
    const address = await getCurrentAddress();
    const account = Account.create();
    const expiration = 60 * 24 * 30;
    const payload = {
      address: account.address.toString(),
      publicKey: bufferToHex(account.publicKey),
      privateKey: bufferToHex(account.privateKey)
    };

    const { Authenticator } = await dependency;
    const identity = await Authenticator.initializeAuthChain(address.toString(), payload, expiration, message => new Personal(eth.provider).sign(message, address, ''));
    const avatar = await Katalyst.get().getProfile(address)
    const profile: Profile = { address, identity, avatar }
    track((segment) => segment.identify(address.toString(), { email: avatar?.email, name: avatar?.name }))
    return setCurrentProfile(profile)
  } catch (err) {
    console.error(err);
    getListener().dispatch('error', err)
    return null
  }
}

export function isExpired(profile: Profile) {
  return profile.identity.expiration.getTime() < Date.now()
}

export function setCurrentProfile(profile: Profile | null) {
  if (profile && isExpired(profile)) {
    profile = null
  }

  CURRENT_PROFILE = profile
  storeProfile(profile)

  if (EXPIRATION_TIMEOUT) {
    clearTimeout(EXPIRATION_TIMEOUT)
  }

  if (profile) {
    EXPIRATION_TIMEOUT = setTimeout(() => {
      const listener = getListener()
      const oldProfile = getCurrentProfile()
      if (oldProfile) {
        listener.dispatch('change', { newProfile: null, oldProfile } as ProfileChangeEvent)
        listener.dispatch('expire', { profile: oldProfile } as ProfileExpiredEvent)
      }
    }, Math.min(
      profile.identity.expiration.getTime() - Date.now(),
      1000 * 60 * 60 * 24
    ))
  }

  return CURRENT_PROFILE
}

export function restoreCurrentProfile() {
  return setCurrentProfile(restoreProfile())
}

export function getCurrentProfile() {
  return CURRENT_PROFILE
}

export function createProfileEffect(
  handleProfile: (event: ProfileChangeEvent) => void,
  handleError: (event: Error) => void,
) {
  const listener = getListener()
  listener.addEventListener('change', handleProfile as any)
  listener.addEventListener('error', handleError as any)

  return () => {
    listener.removeEventListener('change', handleProfile as any)
    listener.removeEventListener('error', handleError as any)
  }
}

export function createProfileEffectHandle(handle: ProfileEffectHandle) {
  const listener = getListener();

  if (handle.error) {
    listener.addEventListener('error', handle.error as any)
  }

  if (handle.change) {
    listener.addEventListener('change', handle.change as any)
  }

  if (handle.expire) {
    listener.addEventListener('expire', handle.expire as any)
  }

  return () => {
    if (handle.error) {
      listener.removeEventListener('error', handle.error as any)
    }

    if (handle.change) {
      listener.removeEventListener('change', handle.change as any)
    }

    if (handle.expire) {
      listener.removeEventListener('expire', handle.expire as any)
    }
  }
}

function handleProfileChange(event: StorageEvent) {
  if (event.key === STORE_PROFILE_KEY && event.oldValue !== event.newValue) {
    if (LOCAl_CHANGE) {
      LOCAl_CHANGE = false
    } else {
      const oldProfile = getCurrentProfile()
      const newProfile = restoreCurrentProfile()

      if (PROFILE_LISTENER) {
        const event: ProfileChangeEvent = {
          oldProfile,
          newProfile,
        }

        PROFILE_LISTENER.dispatch('change', event)
      }
    }
  }
}

function getListener() {
  if (!STORE_LISTENER) {
    STORE_LISTENER = SingletonListener.from(window)
    STORE_LISTENER.addEventListener('storage' as any, handleProfileChange)
  }

  if (!PROFILE_LISTENER) {
    PROFILE_LISTENER = new SingletonListener()
  }

  return PROFILE_LISTENER!
}

function storeProfile(profile: Profile | null) {
  if (STORE_LISTENER) {
    LOCAl_CHANGE = true
  }

  const oldProfile = getCurrentProfile()

  if (!profile) {
    localStorage.removeItem(STORE_PROFILE_KEY)
  } else {
    localStorage.setItem(STORE_PROFILE_KEY, JSON.stringify(profile))
  }

  if (STORE_LISTENER) {
    const event: ProfileChangeEvent = {
      newProfile: profile,
      oldProfile
    }

    getListener().dispatch('change', event)
  }
}

function restoreProfile(): Profile | null {
  const json = localStorage.getItem(STORE_PROFILE_KEY)

  try {
    const data = JSON.parse(json || 'null', (key: string, value: any) => {
      switch (key) {
        case 'expiration':
          try {
            return new Date(Date.parse(value))
          } catch (err) {
            return new Date(0)
          }

        default:
          return value
      }
    })

    if (data) {
      const address = Address.fromString(data.address)
      return { ...data, address }
    }
  } catch (error) {
    console.error(error)
  }

  return null
}
