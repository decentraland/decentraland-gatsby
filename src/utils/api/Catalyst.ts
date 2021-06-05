import type { Address } from 'web3x/address'
import random from '../number/random'
import env from '../env'
import API from './API'
export type {
  Snapshot,
  BodyColor,
  Avatar,
  ProfileResponse,
  Layer,
  Status,
  StatusWithLayers,
  CommsStatus,
  CommsStatusWithLayers,
  LambdasStatus,
  ContentStatus,
  Position,
  Servers,
  LayerUser,
  EntityScene,
} from './Catalyst.types'

import type {
  Avatar,
  ProfileResponse,
  Layer,
  CommsStatus,
  CommsStatusWithLayers,
  LambdasStatus,
  ContentStatus,
  Position,
  Servers,
  LayerUser,
  EntityScene,
} from './Catalyst.types'

export default class Catalyst extends API {
  static Url =
    process.env.GATSBY_CATALYST_API ||
    process.env.REACT_APP_CATALYST_API ||
    process.env.STORYBOOK_CATALYST_API ||
    process.env.CATALYST_API ||
    process.env.GATSBY_PROFILE_URL ||
    process.env.REACT_APP_PROFILE_URL ||
    process.env.STORYBOOK_PROFILE_URL ||
    process.env.PROFILE_URL ||
    'https://peer-ec1.decentraland.org'

  static Servers: Promise<void> | null = null
  static Cache = new Map<string, Catalyst>()

  static get() {
    return this.from(env('PROFILE_URL', this.Url))
  }

  static async getAny() {
    if (!this.Servers) {
      this.Servers = this.get()
        .getServers()
        .then((servers) => {
          for (const server of servers) {
            this.Cache.set(server.address, new Catalyst(server.address))
          }
        })
    }

    await this.Servers
    while (this.Cache.size) {
      const instances = Array.from(this.Cache.values())
      const index = random(instances.length)
      if (instances[index]) {
        const instance = instances[index]
        if (instance.available) {
          return instance
        }

        const result = await API.catch(instance.getStatus())
        if (result) {
          instance.available = true
          return instance
        }

        this.Cache.delete(instance.baseUrl)
      }
    }

    return this.get()
  }

  static from(baseUrl: string) {
    if (!this.Cache.has(baseUrl)) {
      this.Cache.set(baseUrl, new Catalyst(baseUrl))
    }

    return this.Cache.get(baseUrl)!
  }

  private available: boolean | null = null

  async getProfile(address: Address | string): Promise<Avatar | null> {
    const result: ProfileResponse = await this.fetch(
      `/lambdas/profile/${address.toString().toLowerCase()}`
    )
    return (result && result.avatars && result.avatars[0]) || null
  }

  /**
   * loads profile data in parallel
   *
   * @param addresses - profile addresses list
   * @returns array of profiles in the same order used in the addresses param,
   *  if the profile doesn't exists the array will include a `null` in the corresponding
   *  position
   *
   * @example
   * ```typescript
   * getProfiles([ `0x1234...`, 0x00000 ]) => Promise<[ { user: `0x1234...`, ...profile }, null ]>
   * ```
   */
  async getProfiles(
    addresses: (Address | string)[]
  ): Promise<(Avatar | null)[]> {
    if (addresses.length === 0) {
      return []
    }

    const params = new URLSearchParams()
    for (const address of addresses) {
      params.append('id', address.toString().toLowerCase())
    }

    const results: ProfileResponse[] = await this.fetch(
      `/lambdas/profiles/?` + params.toString()
    )
    const map = new Map(
      results.map((result) => {
        const avatar = result.avatars[0]!
        return [avatar.ethAddress.toLowerCase(), avatar] as const
      })
    )

    return addresses.map(
      (address) => map.get(address.toString().toLowerCase()) || null
    )
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

  getContentUrl(hash: string) {
    return this.url(`/content/contents/${hash}`)
  }

  async getEntityScenes(
    pointers: (string | [number, number])[]
  ): Promise<EntityScene[]> {
    if (!pointers || pointers.length === 0) {
      return []
    }

    const params = pointers
      .map((point) => {
        return (
          'pointer=' +
          (Array.isArray(point) ? point.slice(0, 2).join(',') : point)
        )
      })
      .join('&')

    return this.fetch('/content/entities/scene?' + params)
  }

  async getServers() {
    return this.fetch<Servers[]>(`/lambdas/contracts/servers`)
  }

  async getPOIs() {
    const results = await this.fetch<string[]>(`/lambdas/contracts/pois`)
    const pois: Position[] = []
    for (const result of results) {
      const [x, y] = String(result || '')
        .split(',')
        .map(Number)
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
