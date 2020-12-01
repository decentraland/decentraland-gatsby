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

export type Layer = {
  name: string,
  usersCount: number
  maxUsers: number
}

export type Status = {
  name: string,
  version: string,
  currenTime: number,
  env: {
    secure: boolean,
    commitHash: string
  },
  ready: boolean
}

export type StatusWithLayers = Status & {
  layers: (Layer & { usersParcels: number[][] })[]
}

export type LayerUser = {
  "id": string,
  "userId": string,
  "protocolVersion": number,
  "peerId": string,
  "parcel": [number, number],
  "position": [number, number, number],
  "lastPing": number,
  "address": string
}

export default class Catalyst extends API {

  static Url = (
    process.env.GATSBY_PROFILE_URL ||
    process.env.REACT_APP_PROFILE_URL ||
    process.env.STORYBOOK_PROFILE_URL ||
    process.env.PROFILE_URL ||
    'https://peer.decentraland.org'
  )

  static Cache = new Map<string, Catalyst>()

  static get() {
    return this.from(env('PROFILE_URL', this.Url))
  }

  static from(baseUrl: string) {
    if (!this.Cache.has(baseUrl)) {
      this.Cache.set(baseUrl, new Catalyst(baseUrl))
    }

    return this.Cache.get(baseUrl)!
  }

  async getProfile(address: Address | string): Promise<Avatar | null> {
    const result: ProfileResponse = await this.fetch(`/lambdas/profile/${address.toString().toLowerCase()}`)
    return result && result.avatars && result.avatars[0] || null
  }

  async getStatus(): Promise<Status>
  async getStatus(includeLayers: false): Promise<Status>
  async getStatus(includeLayers: true): Promise<StatusWithLayers>
  async getStatus(includeLayers?: boolean) {
    let target = '/comms/status'
    if (includeLayers) {
      target += '?includeLayers=true'
    }
    return this.fetch(target)
  }

  async getLayers() {
    return this.fetch<Layer[]>('/comms/layers')
  }

  async getLayerUsers(layer: string) {
    return this.fetch<LayerUser[]>(`/comms/layers/${layer}/users`)
  }
}
