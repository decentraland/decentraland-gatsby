import env from '../env'
import API from './API'

import type { ContentEntityScene, ContentStatus } from './Catalyst.types'

export default class ContentServer extends API {
  static Url = env(
    'WORLDS_CONTENT_SERVER',
    'https://worlds-content-server.decentraland.org/'
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

  async getContentStatus(): Promise<ContentStatus> {
    return this.fetch('/status')
  }

  getContentUrl(hash: string) {
    return this.url(`/contents/${hash}`)
  }

  async getContentEntity(hash: string): Promise<ContentEntityScene> {
    return this.fetch(`/contents/${hash}`)
  }
}
