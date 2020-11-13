import { toBN } from 'web3x/utils'
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

export type MapContent = {
  "assets": {
    "parcels": Parcel[],
    "estates": Estate[]
  },
  "total": number
}

const CLEAR_LOW = toBN('0xffffffffffffffffffffffffffffffff00000000000000000000000000000000');
const CLEAR_HIGH = toBN('0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff');
const FACTOR = toBN('0x100000000000000000000000000000000');
const FACTOR_LOW = toBN('0x10000000000000000000000000000000000000000000000000000000000000000');
const REVERSE_FACTOR = toBN('0x1000000000000000000000000000000');

export default class Land extends API {

  static Url = (
    process.env.GATSBY_LAND_URL ||
    process.env.REACT_APP_LAND_URL ||
    process.env.STORYBOOK_LAND_URL ||
    process.env.LAND_URL ||
    'https://api.decentraland.org/v1'
  )

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

  async getMapContent(nw: [number, number], se: [number, number]): Promise<MapContent> {
    return this.fetch('/map' + this.query({ nw, se }))
  }

  encodeParcelId(coordinates: [number, number]): string {
    const [ x, y ] = coordinates
    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      -1000000 >= x ||
      x >= 1000000 ||
      -1000000 >= y ||
      y >= 1000000
    ) {
      throw new RangeError(`The coordinates should be inside bounds`)
    }

    const absX = toBN(Math.abs(x))
    const absY = toBN(Math.abs(y))
    const uintX = x < 0 ? FACTOR_LOW.sub(absX) : absX
    const uintY = y < 0 ? FACTOR.sub(absY) : absY

    let bX = (toBN(uintX).mul(FACTOR)).and(CLEAR_LOW)
    let bY = toBN(uintY).and(CLEAR_HIGH)
    return bX.or(bY).toString()
  }

  decodeParcelId(parcelId: string): [number, number] {

    const bn = toBN(parcelId)
    const bnX = bn.div(FACTOR)
    const bnY = bn.mod(FACTOR)
    const x = bnX.gte(REVERSE_FACTOR) ? bnX.sub(FACTOR).toNumber() : bnX.toNumber()
    const y = bnY.gte(REVERSE_FACTOR) ? bnY.sub(FACTOR).toNumber() : bnY.toNumber()

    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      -1000000 >= x ||
      x >= 1000000 ||
      -1000000 >= y ||
      y >= 1000000
    ) {
      throw new RangeError(`The coordinates should be inside bounds`)
    }

    return [x, y]
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