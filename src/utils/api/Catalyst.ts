import rollbar from '../development/rollbar'
import segment from '../development/segment'
import env from '../env'
import random from '../number/random'
import API from './API'

import type {
  Avatar,
  CommsStatus,
  CommsStatusOptions,
  CommsStatusWithLayers,
  CommsStatusWithUsers,
  ContentDeploymentOptions,
  ContentDeploymentResponse,
  ContentStatus,
  EntityScene,
  HotScene,
  LambdasStatus,
  Layer,
  LayerUser,
  Peer,
  Position,
  ProfileResponse,
  Realm,
  Servers,
  StatsParcel,
} from './Catalyst.types'
import type { AuthChain } from '@dcl/crypto'
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

export default class Catalyst extends API {
  static Url =
    env('CATALYST_API', '') || // @deprecated
    env('PROFILE_URL', 'https://peer.decentraland.org')

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
            this.Cache.set(server.baseUrl, new Catalyst(server.baseUrl))
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

  async getProfile(address: string): Promise<Avatar | null> {
    const result: ProfileResponse = await this.fetch(
      `/lambdas/profile/${address.toLowerCase()}`
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
  async getProfiles(addresses: string[]): Promise<(Avatar | null)[]> {
    if (addresses.length === 0) {
      return []
    }

    const params = new URLSearchParams()
    for (const address of addresses) {
      params.append('id', address.toLowerCase())
    }

    const results: ProfileResponse[] = await this.fetch(
      `/lambdas/profiles/?` + params.toString()
    )

    const map = new Map(
      results
        .filter((result) => {
          const avatar = result.avatars[0]!
          if (!avatar.ethAddress) {
            rollbar((logger) =>
              logger.error(`Error loading profiles`, {
                avatar,
                addresses,
                server: this.baseUrl,
              })
            )
            segment((analytics) =>
              analytics.track('error', {
                message: `Error loading profiles`,
                server: this.baseUrl,
                addresses,
                avatar,
              })
            )
            return false
          }

          return true
        })
        .map((result) => {
          const avatar = result.avatars[0]!
          return [avatar.ethAddress.toLowerCase(), avatar] as const
        })
    )

    return addresses.map((address) => map.get(address.toLowerCase()) || null)
  }

  async getStatus(): Promise<CommsStatus>
  async getStatus(includeLayers: {}): Promise<CommsStatus>
  async getStatus(includeLayers: false): Promise<CommsStatus>
  async getStatus(includeLayers: true): Promise<CommsStatusWithLayers>
  async getStatus(includeLayers: {
    includeLayers: true
  }): Promise<CommsStatusWithLayers>
  async getStatus(includeLayers: {
    includeUsersParcels: true
  }): Promise<CommsStatusWithUsers>
  async getStatus(options?: CommsStatusOptions) {
    return this.getCommsStatus(options as any)
  }

  async getCommsStatus(): Promise<CommsStatus>
  async getCommsStatus(includeLayers: {}): Promise<CommsStatus>
  async getCommsStatus(includeLayers: false): Promise<CommsStatus>
  async getCommsStatus(includeLayers: true): Promise<CommsStatusWithLayers>
  async getCommsStatus(includeLayers: {
    includeLayers: true
  }): Promise<CommsStatusWithLayers>
  async getCommsStatus(includeLayers: {
    includeUsersParcels: true
  }): Promise<CommsStatusWithUsers>
  async getCommsStatus(options?: CommsStatusOptions) {
    const params = new URLSearchParams()
    if (options) {
      if (typeof options === 'boolean') {
        params.append('includeLayers', 'true')
      } else if (typeof options === 'object') {
        if ((options as { includeLayers: boolean }).includeLayers) {
          params.append('includeLayers', 'true')
        } else if (
          (options as { includeUsersParcels: boolean }).includeUsersParcels
        ) {
          params.append('includeUsersParcels', 'true')
        }
      }
    }

    let target = '/comms/status'
    if (params.toString()) {
      target += '?' + params.toString()
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

  async getRealms() {
    this.fetch<Realm[]>('/lambdas/explore/realms')
  }

  async getHostScenes() {
    this.fetch<HotScene[]>('/lambdas/explore/hot-scenes')
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

  /**
   * @deprecated by the archipelago update
   * @see https://decentraland.org/blog/project-updates/communication-protocol-improvements/
   * @see https://github.com/decentraland/adr/blob/main/docs/ADR-35-coms-protocol-optimizations.md
   */
  async getLayers() {
    return this.fetch<Layer[]>('/comms/layers')
  }

  /**
   * @deprecated by the archipelago update
   * @see https://decentraland.org/blog/project-updates/communication-protocol-improvements/
   * @see https://github.com/decentraland/adr/blob/main/docs/ADR-35-coms-protocol-optimizations.md
   */
  async getLayerUsers(layer: string) {
    return this.fetch<LayerUser[]>(`/comms/layers/${layer}/users`)
  }

  async getPeers() {
    const result = await this.fetch<{ ok: boolean; peers: Peer[] }>(
      `/comms/peers`
    )
    return result.peers
  }

  async getContentDeployments(
    options: Partial<ContentDeploymentOptions>
  ): Promise<ContentDeploymentResponse> {
    const { entityIds, entityTypes, ...data } = options
    const params = API.searchParams(data as any, { dataToTimestamp: true })

    if (Array.isArray(entityIds)) {
      for (const entityId of entityIds) {
        params.append('entityId', entityId)
      }
    }

    if (Array.isArray(entityTypes)) {
      for (const entityType of entityTypes) {
        params.append('entityType', entityType)
      }
    }

    const query = params.toString()

    return this.fetch('/content/deployments' + (query ? '?' : '') + query)
  }

  async getStatsParcels() {
    return this.fetch<{ parcels: StatsParcel[] }>('/stats/parcels')
  }

  async verifySignature(
    authChain: AuthChain,
    message: string
  ): Promise<{ ownerAddress: string; valid: boolean }> {
    return this.fetch(
      `/lambdas/crypto/validate-signature`,
      this.options().method('POST').json({ authChain, timestamp: message })
    )
  }
}
