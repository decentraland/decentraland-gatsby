import type { Address } from 'web3x/address'
import random from '../number/random'
import env from '../env'
import API from './API'

export type Snapshot = {
  face: string,
  body: string,
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

export type Status = CommsStatus
export type StatusWithLayers = CommsStatusWithLayers

export type CommsStatus = {
  name: string,
  version: string,
  currenTime: number,
  env: {
    secure: boolean,
    commitHash: string
  },
  ready: boolean
}

export type CommsStatusWithLayers = CommsStatus & {
  layers: (Layer & { usersParcels: Position[] })[]
}

export type LambdasStatus = {
  version: string,
  currentTime: number,
  contentServerUrl: string,
  commitHash: string
}

export type ContentStatus = {
  name: string,
  version: string,
  currentTime: number,
  lastImmutableTime: number,
  historySize: number,
  synchronizationStatus: {
    otherServers: {
      address: string,
      connectionState: "Connected" | "Connection lost" | "Could never be reached",
      lastDeploymentTimestamp: number
    }[],
    lastSyncWithDAO: number,
    synchronizationState: "Bootstrapping" | "Syncing" | "Synced" | "Failed to sync" ,
    lastSyncWithOtherServers: number
  },
  commitHash: string,
  ethNetwork: string
}

export type Position = [number, number]

export type Servers = {
  address: string,
  owner: string,
  id: string
}

export type LayerUser = {
  id: string,
  userId: string,
  protocolVersion: number,
  peerId: string,
  parcel: [number, number],
  position: [number, number, number],
  lastPing: number,
  address: string
}

export default class Catalyst extends API {

  static Url = (
    process.env.GATSBY_PROFILE_URL ||
    process.env.REACT_APP_PROFILE_URL ||
    process.env.STORYBOOK_PROFILE_URL ||
    process.env.PROFILE_URL ||
    'https://peer.decentraland.org'
  )

  static Servers: Promise<void> | null = null
  static Cache = new Map<string, Catalyst>()

  static get() {
    return this.from(env('PROFILE_URL', this.Url))
  }

  static async getAny() {
    if (!this.Servers) {
      this.Servers = this.get().getServers()
        .then((servers) => {
          for (const server of servers) {
            this.Cache.set(server.address, new Catalyst(server.address))
          }
        })
    }

    await this.Servers
    const instaces = Array.from(this.Cache.values())
    const index = random(instaces.length)
    return instaces[index] || this.get()
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

  async getStatus(): Promise<CommsStatus>
  async getStatus(includeLayers: false): Promise<CommsStatus>
  async getStatus(includeLayers: true): Promise<CommsStatusWithLayers>
  async getStatus(includeLayers?: boolean) {
    return this.getCommsStatus(includeLayers as any)
  }

  async getCommsStatus(): Promise<CommsStatus>
  async getCommsStatus(includeLayers: false): Promise<CommsStatus>
  async getCommsStatus(includeLayers: true): Promise<CommsStatusWithLayers>
  async getCommsStatus(includeLayers?: boolean) {
    let target = '/comms/status'
    if (includeLayers) {
      target += '?includeLayers=true'
    }
    return this.fetch(target)
  }

  async getLambdasStatus(): Promise<LambdasStatus> {
    return this.fetch('/lambdas/status')
  }
  async getContentStatus(): Promise<ContentStatus> {
    return this.fetch('/content/status')
  }

  async getServers() {
    return this.fetch<Servers[]>(`/lambdas/contracts/servers`)
  }

  async getPOIs() {
    const results = await this.fetch<string[]>(`/lambdas/contracts/pois`)
    const pois: Position[] = []
    for (const result of results) {
      const [x, y] = String(result || '').split(',').map(Number)
      if (Number.isFinite(x) && Number.isFinite(y)) {
        pois.push([x, y] as Position)
      }
    }

    return pois
  }

  async getBanNames() {
    return this.fetch<string[]>(`/lambdas/contracts/denylisted-names`)
  }

  async getLayers() {
    return this.fetch<Layer[]>('/comms/layers')
  }

  async getLayerUsers(layer: string) {
    return this.fetch<LayerUser[]>(`/comms/layers/${layer}/users`)
  }
}
