import env from '../env'
import API from './API'

import type { ContentDeploymentWorld } from './Catalyst.types'

export default class ContentServer extends API {
  static Url = env(
    'WORLDS_CONTENT_SERVER',
    'https://worlds-content-server.decentraland.org/contents/'
  )

  static Cache = new Map<string, ContentServer>()

  static getInstance() {
    return this.getInstanceFrom(this.Url)
  }

  static getInstanceFrom(baseUrl: string) {
    if (!this.Cache.has(baseUrl)) {
      this.Cache.set(baseUrl, new ContentServer(baseUrl))
    }

    return this.Cache.get(baseUrl)!
  }

  getContentUrl(hash: string) {
    return this.url(hash)
  }

  async getContentEntity(hash: string): Promise<ContentDeploymentWorld> {
    return this.fetch(hash)
  }
}
