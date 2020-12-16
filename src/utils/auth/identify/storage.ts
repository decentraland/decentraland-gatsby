// TODO v3: remove web3x
import { Address } from 'web3x/address';
import { Profile } from '../types';
import {
  getCurrentProfile as getMemoryProfile,
  setCurrentProfile as setMemoryProfile,
  ensureProfile
} from './memory';

export const STORE_PROFILE_KEY = 'auth'

export function getCurrentProfile(): Profile | null {
  return getMemoryProfile() || setMemoryProfile(getStorageProfile())
}

export function setCurrentProfile(profile: Profile | null) {
  profile = ensureProfile(profile)
  setMemoryProfile(profile)
  setStorageProfile(profile)
  return profile
}

function setStorageProfile(profile: Profile | null) {
  if (!profile) {
    localStorage.removeItem(STORE_PROFILE_KEY)
  } else {
    localStorage.setItem(STORE_PROFILE_KEY, JSON.stringify(profile))
  }
}

function getStorageProfile(): Profile | null {
  const json = localStorage.getItem(STORE_PROFILE_KEY)

  try {
    const data = JSON.parse(json || 'null', restoreProfileReviver)
    if (data) {
      const address = Address.fromString(data.address)
      return { ...data, address }
    }

  } catch (error) {
    console.error(error)
  }

  return null
}

function restoreProfileReviver(key: string, value: any) {
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
}
