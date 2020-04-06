import { useEffect } from 'react'
import { Profile } from '../utils/auth/types'
import identify, { restoreCurrentProfile, setCurrentProfile, createProfileEffect, getCurrentProfile } from "../utils/auth/identify"
import usePatchState from './usePatchState'
import getProvider from '../utils/auth/getProvider'
import WalletConnectError from '../utils/errors/WalletConnectError'
import WalletTimeoutError from '../utils/errors/WalletTimeoutError'
import EmptyAccountsError from '../utils/errors/EmptyAccountsError'

let CURRENT_PROFILE_LOADER: Promise<Profile | null> | null = null

type WalletError = WalletConnectError | WalletTimeoutError | EmptyAccountsError | Error & { code?: string } | null

type State = {
  loading: boolean
  provider: boolean
  error: WalletError
  profile: Profile | null
}

export type ProfileActions = {
  connect: () => Promise<Profile | null>
  disconnect: () => Promise<null>
  loading: boolean
  provider: boolean
  error: WalletError
}

export default function useProfile() {
  const [{ profile, loading, provider, error }, patchState] = usePatchState<State>({ profile: null, loading: true, provider: false, error: null })

  async function connect() {
    if (profile) {
      return profile
    }

    if (CURRENT_PROFILE_LOADER) {
      patchState({ loading: true })
      const result = await CURRENT_PROFILE_LOADER
      patchState({ loading: false })
      return result
    }

    CURRENT_PROFILE_LOADER = identify().catch((err) => {
      CURRENT_PROFILE_LOADER = null
      console.error(err);
      return null
    })

    patchState({ loading: true })

    try {
      const result = await CURRENT_PROFILE_LOADER
      patchState({ loading: false, profile: result })
      return result
    } catch (error) {
      patchState({ loading: false, profile: null })
      throw error
    }
  }

  async function disconnect() {
    CURRENT_PROFILE_LOADER = null
    setCurrentProfile(null)
    patchState({ loading: false, profile: null })
    return null
  }

  useEffect(() => {
    patchState({
      loading: false,
      provider: !!getProvider(),
      profile: getCurrentProfile() || restoreCurrentProfile()
    })

    return createProfileEffect(
      (event) => patchState({ profile: event.newProfile }),
      (error) => patchState({ loading: false, error })
    )
  }, [])

  const actions: ProfileActions = {
    connect,
    disconnect,
    loading,
    provider,
    error
  }

  return [profile, actions] as const
}