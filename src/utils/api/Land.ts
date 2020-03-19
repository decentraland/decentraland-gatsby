import API from './API'
import env from '../env'
import Options from './Options'

export type GetListOptions = {
  status?: 'open' | 'cancelled' | 'sold'
  sortBy?: 'price' | 'created_at' | 'block_time_updated_at' | 'expires_at'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export type GetImageOptions = {
  width?: number
  height?: number
  size?: number
  publications?: boolean
}

export type GetMapImageOptions = GetImageOptions & {
  center?: [number, number]
  selected?: [number, number][]
}

export type Parcel = {
  "id": string,
  "x": number,
  "y": number,
  "auction_price": number,
  "district_id": string | null,
  "owner": string,
  "data": {
    "ipns"?: string
    "name"?: string
    "description"?: string
    "version": number
  },
  "auction_owner": string
  "tags"?: {
    "proximity"?: {
      "road"?: {
        "district_id": string,
        "distance": number
      }
    }
  },
  "last_transferred_at": string | null,
  "estate_id": string | null,
  "update_operator": string | null,
  "auction_timestamp": string | null,
  "operator": string | null,
  "publication": string | null,
  "update_managers": string[],
  "approvals_for_all": string[]
}

export type Estate = {
  "id": string,
  "owner": string,
  "data": {
    "ipns"?: string,
    "name"?: string,
    "parcels"?: { x: number, y: number }[],
    "description"?: string,
    "version": number,
  },
  "last_transferred_at": string,
  "tx_hash": string,
  "token_id": string,
  "update_operator": string | null,
  "district_id": string | null,
  "operator": string | null,
  "publication": string | null,
  "update_managers": string[],
  "approvals_for_all": string[]
}

export default class Land extends API {

  static Url = 'https://api.decentraland.org/v1'

  static Cache = new Map<string, Land>()

  static get() {
    return this.from(env('LAND_URL', this.Url))
  }

  static from(baseUrl: string) {
    if (!this.Cache.has(baseUrl)) {
      this.Cache.set(baseUrl, new Land(baseUrl))
    }

    return this.Cache.get(baseUrl)!
  }

  async fetch<T extends object>(url: string, options: Options = new Options({})) {
    const result = await super.fetch<{ ok: boolean, data: T }>(url, options)
    return result.data
  }

  async getParcel(coordinates: [number, number]): Promise<Parcel> {
    const [x, y] = coordinates
    return this.fetch(`/parcels/${x}/${y}`)
  }

  async getEstate(id: number | string): Promise<Estate> {
    return this.fetch(`/estates/${id}`)
  }

  async getParcels(options: GetListOptions = {}): Promise<Parcel[]> {
    const { sortBy: sort_by, sortOrder: sort_order } = options
    return this.fetch('/parcels' + this.query({ ...options, sort_by, sort_order }))
  }

  async getEstates(options: GetListOptions = {}): Promise<Estate[]> {
    const { sortBy: sort_by, sortOrder: sort_order } = options
    return this.fetch('/estates' + this.query({ ...options, sort_by, sort_order }))
  }

  getImage(options: GetMapImageOptions = {}) {
    const { selected: rawSelected } = options
    const selected = rawSelected && rawSelected.map((position) => position.join(',')).join(';')
    return this.url(`/map.png` + this.query({ ...options, selected }))
  }

  getParcelImage(coordinates: [number, number], options: GetImageOptions = {}) {
    const [x, y] = coordinates
    return this.url(`/parcels/${x}/${y}/map.png` + this.query(options))
  }

  getEstateImage(id: number | string, options: GetImageOptions = {}) {
    return this.url(`/estates/${id}/map.png` + this.query(options))
  }
}