import { useEffect } from 'react'
import { Profile } from '../utils/auth/types'
import identify, { restoreCurrentProfile, setCurrentProfile, createProfileEffect } from "../utils/auth/identify"
import usePatchState from './usePatchState'

let CURRENT_PROFILE_LOADER: Promise<Profile | null> | null = null

type State = {
  loading: boolean
  profile: Profile | null
}

export type ProfileActions = {
  connect: () => Promise<Profile | null>
  disconnect: () => Promise<null>
}

export default function useProfile() {
  const [{ profile, loading }, patchState] = usePatchState<State>({ profile: null, loading: true })

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

    CURRENT_PROFILE_LOADER = identify()

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
    patchState({ loading: false, profile: restoreCurrentProfile() })
    return createProfileEffect((event) => patchState({ profile: event.newProfile }))
  }, [])

  const actions: ProfileActions = {
    connect,
    disconnect
  }

  return [profile, loading, actions] as const
}