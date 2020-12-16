// TODO v3: remove web3x
import { Profile } from '../types';

let CURRENT_PROFILE: Profile | null = null

export function isExpired(profile: Profile) {
  return profile.identity.expiration.getTime() < Date.now()
}

export function ensureProfile(profile: Profile | null) {
  return profile && !isExpired(profile) ? profile : null
}

export function setCurrentProfile(profile: Profile | null) {
  CURRENT_PROFILE = ensureProfile(profile)
  return CURRENT_PROFILE
}

export function getCurrentProfile() {
  return CURRENT_PROFILE
}
