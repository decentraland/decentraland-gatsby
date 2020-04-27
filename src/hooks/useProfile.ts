import { useEffect } from 'react'
import { Profile } from '../utils/auth/types'
import identify, { restoreCurrentProfile, setCurrentProfile, getCurrentProfile, createProfileEffectHandle } from "../utils/auth/identify"
import usePatchState from './usePatchState'
import getProvider from '../utils/auth/getProvider'
import WalletConnectError from '../utils/errors/WalletConnectError'
import WalletTimeoutError from '../utils/errors/WalletTimeoutError'
import EmptyAccountsError from '../utils/errors/EmptyAccountsError'
import track from '../components/Segment/track'

let CURRENT_PROFILE_LOADER: Promise<Profile | null> | null = null

type WalletError = WalletConnectError | WalletTimeoutError | EmptyAccountsError | Error & { code?: string } | null

type State = {
  loading: boolean
  provider: boolean
  error: WalletError
  profile: Profile | null
}

enum Event {
  Connect = 'Connect',
  Connected = 'Connected',
  Disconnected = 'Disconnected',
}

export type ProfileActions = {
  connect: (force?: boolean) => Promise<Profile | null>
  disconnect: () => Promise<null>
  loading: boolean
  provider: boolean
  error: WalletError
}

export default function useProfile() {
  const [{ profile, loading, provider, error }, patchState] = usePatchState<State>({ profile: null, loading: true, provider: false, error: null })

  async function connect(force: boolean = false) {
    if (profile && !force) {
      return profile
    }

    track((analytics) => analytics.track(Event.Connect))

    if (CURRENT_PROFILE_LOADER && !force) {
      patchState({ loading: true })
      const result = await CURRENT_PROFILE_LOADER
      patchState({ loading: false })
      return result
    }

    patchState({ loading: true })
    CURRENT_PROFILE_LOADER = identify()

    try {
      const result = await CURRENT_PROFILE_LOADER
      patchState({ loading: false, profile: result })

      if (result === null) {
        CURRENT_PROFILE_LOADER = null
      } else {
        track((analytics) => analytics.track(Event.Connected))
      }

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
    track((analytics) => analytics.track(Event.Disconnected))
    return null
  }

  useEffect(() => {
    patchState({
      loading: false,
      provider: !!getProvider(),
      profile: getCurrentProfile() || restoreCurrentProfile()
    })

    return createProfileEffectHandle({
      error: (error) => patchState({ loading: false, error }),
      change: (event) => patchState({ profile: event.newProfile }),
      expire: () => connect(true),
    })
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