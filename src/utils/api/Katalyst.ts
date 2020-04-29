import type { Address } from 'web3x/address'
import API from './API'
import env from '../env'

export type Snapshot = {
  "face": string,
  "body": string,
}

export type BodyColor = {
  color: {
    color: {
      r: number
      g: number
      b: number
      a: number
    }
  }
}

export type Avatar = {
  userId: string,
  email: string | null | undefined
  name: string | null | undefined
  hasClaimedName: boolean
  description: string | null | undefined
  ethAddress: string
  version: number
  avatar: {
    bodyShape: string,
    snapshots: Snapshot,
    eyes: BodyColor,
    hair: BodyColor,
    skin: BodyColor,
    wearables: string[],
    version: number
  },
  inventory: string[],
  blocked: string[],
  tutorialStep: number
}

export type ProfileResponse = {
  avatars: Avatar[]
}

export default class Katalyst extends API {

  static Url = 'https://peer.decentraland.org/lambdas'

  static Cache = new Map<string, Katalyst>()

  static get() {
    return this.from(env('PROFILE_URL', this.Url))
  }

  static from(baseUrl: string) {
    if (!this.Cache.has(baseUrl)) {
      this.Cache.set(baseUrl, new Katalyst(baseUrl))
    }

    return this.Cache.get(baseUrl)!
  }

  async getProfile(address: Address | string): Promise<Avatar | null> {
    const result: ProfileResponse = await this.fetch(`/profile/${address.toString().toLowerCase()}`)
    return result && result.avatars && result.avatars[0] || null
  }
}