import { Profile, ProfileChangeEvent, ProfileEffectHandle } from '../types';
import SingletonListener from '../../SingletonListener';
import { ensureProfile, getCurrentProfile as getMemoryProfile } from './memory';
import { setCurrentProfile as setStorageProfile, getCurrentProfile as getStorageProfile } from './storage';

export function setCurrentProfile(profile: Profile | null) {
  profile = ensureProfile(profile)
  setStorageProfile(profile)
}

export function getCurrentProfile() {

}

let STORE_LISTENER: SingletonListener<Window> | null = null
let PROFILE_LISTENER: SingletonListener<any> | null = null
let LOCAl_CHANGE = false

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
