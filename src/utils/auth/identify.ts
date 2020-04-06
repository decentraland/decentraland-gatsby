import { Address } from 'web3x/address';
import { Account } from 'web3x/account';
import { Personal } from 'web3x/personal';
import { bufferToHex } from 'web3x/utils';
import { Authenticator } from 'dcl-crypto/dist/Authenticator';
import { Profile, ProfileChangeEvent } from './types';
import getEth from './getEth';
import getCurrentAddress from './getCurrentAddress';
import Katalyst from '../api/Katalyst';
import SingletonListener from '../SingletonListener';
import track from '../../components/Segment/track';

export const STORE_PROFILE_KEY = 'auth'
let CURRENT_PROFILE: Profile | null = null
let STORE_LISTENER: SingletonListener<Window> | null = null
let PROFILE_LISTENER: SingletonListener<any> | null = null
let LOCAl_CHANGE = false

export default async function identify() {
  if (CURRENT_PROFILE) {
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

    const identity = await Authenticator.initializeAuthChain(address.toString(), payload, expiration, message => new Personal(eth.provider).sign(message, address, ''));
    const avatar = await Katalyst.get().getProfile(address)
    const profile: Profile = { address, identity, avatar }
    track((segment) => segment.identify(address.toString()))
    return setCurrentProfile(profile)
  } catch (err) {
    getListener().dispatch('error', err)
    return null
  }
}

export function setCurrentProfile(profile: Profile | null) {
  storeProfile(profile)
  CURRENT_PROFILE = profile
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

function handleProfileChange(event: StorageEvent) {
  if (event.key === STORE_PROFILE_KEY && event.oldValue !== event.newValue) {
    if (LOCAl_CHANGE) {
      LOCAl_CHANGE = false
    } else {
      const oldProfile = getCurrentProfile()
      const newProfile = restoreCurrentProfile()

      if (PROFILE_LISTENER) {
        const event: ProfileChangeEvent = {
          local: false,
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
      local: true,
      newProfile: profile,
      oldProfile
    }

    getListener().dispatch('change', event)
  }
}

function restoreProfile(): Profile | null {
  const json = localStorage.getItem(STORE_PROFILE_KEY)

  try {
    const data = JSON.parse(json || 'null')
    if (data) {
      const address = Address.fromString(data.address)
      return { ...data, address }
    }
  } catch (error) {
    console.error(error)
  }

  return null
}
