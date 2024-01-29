import { BigNumber } from '@ethersproject/bignumber'

import env from '../env'
import API from './API'
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

export type Position = string | [number, number]

export type GetMapImageV2Options = Omit<GetImageOptions, 'publications'> & {
  center?: Position
  selected?: Position[]
}

type Token = {
  id: string
  name: string
  description: string
  image: string
  external_url: string
  background_color: string
}

export type Parcel = Token & {
  attributes: {
    trait_type: 'X' | 'Y' | 'Distance to District' | 'Distance to Road'
    value: number
    display_type: 'number'
  }[]
}

export type Estate = Token & {
  attributes: {
    trait_type: 'Size' | 'Distance to District' | 'Distance to Road'
    value: number
    display_type: 'number'
  }[]
}

export type Tile = {
  id: string
  x: number
  y: number
  type: 'owned' | 'unowned' | 'plaza' | 'road' | 'district'
  top: boolean
  left: boolean
  topLeft: boolean
  updatedAt: number
  name?: string
  owner?: string
  estateId?: string
  tokenId?: string
  price?: number
}

export type MapContent = {
  assets: {
    parcels: Parcel[]
    estates: Estate[]
  }
  total: number
}

const CLEAR_LOW = BigNumber.from(
  '0xffffffffffffffffffffffffffffffff00000000000000000000000000000000'
)
const CLEAR_HIGH = BigNumber.from(
  '0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff'
)
const FACTOR = BigNumber.from('0x100000000000000000000000000000000')
const FACTOR_LOW = BigNumber.from(
  '0x10000000000000000000000000000000000000000000000000000000000000000'
)
const REVERSE_FACTOR = BigNumber.from('0x1000000000000000000000000000000')

export default class Land extends API {
  static Url =
    env('LAND_API', '') || // @deprecated
    env('LAND_URL', 'https://api.decentraland.org')

  static Cache = new Map<string, Land>()

  /**
   * TODO(#323): remove on v6
   * @deprecated use getInstance instead
   */
  static get() {
    return this.getInstance()
  }

  static getInstance() {
    return this.getInstanceFrom(env('LAND_URL', this.Url))
  }

  /**
   * TODO(#323): remove on v6
   * @deprecated use getInstanceFrom instead
   */
  static from(baseUrl: string) {
    return this.getInstanceFrom(baseUrl)
  }

  static getInstanceFrom(baseUrl: string) {
    if (!this.Cache.has(baseUrl)) {
      this.Cache.set(baseUrl, new Land(baseUrl))
    }

    return this.Cache.get(baseUrl)!
  }

  static encodePosition(position: Position): string {
    if (typeof position === 'string') {
      return position
    } else {
      return position.slice(0, 2).join(',')
    }
  }

  static decodePosition(position: Position): [number, number] {
    if (typeof position === 'string') {
      return position.split(',').slice(0, 2).map(Number) as [number, number]
    } else {
      return position
    }
  }

  static encodeParcelId(coordinates: [number, number]): string {
    const [x, y] = coordinates
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

    const absX = BigNumber.from(Math.abs(x))
    const absY = BigNumber.from(Math.abs(y))
    const uintX = x < 0 ? FACTOR_LOW.sub(absX) : absX
    const uintY = y < 0 ? FACTOR.sub(absY) : absY

    const bX = BigNumber.from(uintX).mul(FACTOR).and(CLEAR_LOW)
    const bY = BigNumber.from(uintY).and(CLEAR_HIGH)
    return bX.or(bY).toString()
  }

  static decodeParcelId(parcelId: string): [number, number] {
    const bn = BigNumber.from(parcelId)
    const bnX = bn.div(FACTOR)
    const bnY = bn.mod(FACTOR)
    const x = bnX.gte(REVERSE_FACTOR)
      ? bnX.sub(FACTOR).toNumber()
      : bnX.toNumber()
    const y = bnY.gte(REVERSE_FACTOR)
      ? bnY.sub(FACTOR).toNumber()
      : bnY.toNumber()

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

  async fetch<T extends {}>(url: string, options: Options = new Options({})) {
    const result = await super.fetch<{ ok: boolean; data: T }>(url, options)
    return result.data
  }

  async getPositionName(position: [number, number]) {
    const tile = await this.getTile(position)
    if (tile && tile.name && tile.name !== 'Roads') {
      return tile.name
    }

    const parcel = await this.getParcel(position)
    if (
      parcel &&
      parcel.name &&
      parcel.name !== `Parcel ${position.join(',')}`
    ) {
      return parcel.name
    }

    return 'Decentraland'
  }

  async getParcel(position: [number, number]): Promise<Parcel> {
    const [x, y] = position
    return this.fetch(`/v2/parcels/${x}/${y}`)
  }

  async getEstate(id: number | string): Promise<Estate> {
    return this.fetch(`/v2/estates/${id}`)
  }

  async getParcels(options: GetListOptions = {}): Promise<Parcel[]> {
    const { sortBy: sort_by, sortOrder: sort_order } = options
    return this.fetch(
      `/v2/parcels` + this.query({ ...options, sort_by, sort_order })
    )
  }

  async getEstates(options: GetListOptions = {}): Promise<Estate[]> {
    const { sortBy: sort_by, sortOrder: sort_order } = options
    return this.fetch(
      `/v2/estates` + this.query({ ...options, sort_by, sort_order })
    )
  }

  /** @deprecated */
  async getMapContent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nw: [number, number],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    se: [number, number]
  ): Promise<MapContent> {
    throw new Error(`Endpoint /v1/map is deprecated`)
  }

  /**
   * Get a map of tiles
   * @param position1
   * @param position2
   * @param options
   * @returns
   */
  async getTiles(
    position1: [number, number],
    position2: [number, number],
    options: { include?: (keyof Tile)[]; exclude?: (keyof Tile)[] } = {}
  ): Promise<Record<string, Tile>> {
    const params = new URLSearchParams({
      x1: String(position1[0]),
      y1: String(position1[1]),
      x2: String(position2[0]),
      y2: String(position2[1]),
    })

    if (options.include && options.include.length > 0) {
      params.append('include', options.include.join(','))
    }

    if (options.exclude && options.exclude.length > 0) {
      params.append('include', options.exclude.join(','))
    }

    return this.fetch(`/v2/tiles?` + params.toString())
  }

  async getTile(
    position: [number, number],
    options: { include?: (keyof Tile)[]; exclude?: (keyof Tile)[] } = {}
  ): Promise<Tile | null> {
    const tiles = await this.getTiles(position, position, options)
    return tiles[position.join(',')] || null
  }

  encodeParcelId(coordinates: [number, number]): string {
    return Land.encodeParcelId(coordinates)
  }

  decodeParcelId(parcelId: string): [number, number] {
    return Land.decodeParcelId(parcelId)
  }

  /** @deprecated use getMapImage instead */
  getImage(options: GetMapImageOptions = {}) {
    const { selected: rawSelected } = options
    const selected =
      rawSelected && rawSelected.map((position) => position.join(',')).join(';')
    return this.url(`/v1/map.png` + this.query({ ...options, selected }))
  }

  getParcelImage(coordinates: [number, number], options: GetImageOptions = {}) {
    const [x, y] = coordinates
    return this.url(`/v1/parcels/${x}/${y}/map.png` + this.query(options))
  }

  getEstateImage(id: number | string, options: GetImageOptions = {}) {
    return this.url(`/v1/estates/${id}/map.png` + this.query(options))
  }

  getMapImage(options: GetMapImageV2Options = {}) {
    const params = new URLSearchParams()

    let width: number
    let height: number
    if (!!options.width && !!options.height) {
      height = options.height
      width = options.width
    } else if (!!options.width && !options.height) {
      height = options.width
      width = options.width
    } else if (!options.width && !!options.height) {
      height = options.height
      width = options.height
    } else {
      height = 1024
      width = 1024
    }

    params.set('height', String(height))
    params.set('width', String(width))

    if (options.selected && options.selected.length) {
      params.set(
        'selected',
        options.selected
          .map((position) => Land.encodePosition(position))
          .join(';')
      )
    }

    if (options.center) {
      params.set('center', Land.encodePosition(options.center))
    }

    if (options.size) {
      params.set('center', String(options.size))
    }

    if (
      (!options.center || !options.size) &&
      options.selected &&
      options.selected.length
    ) {
      const Xs = options.selected.map(
        (position) => Land.decodePosition(position)[0]
      )
      const Ys = options.selected.map(
        (position) => Land.decodePosition(position)[1]
      )
      const maxX = Math.max(...Xs)
      const minX = Math.min(...Xs)
      const maxY = Math.max(...Ys)
      const minY = Math.min(...Ys)

      if (!options.center) {
        const centerX = Math.floor((minX + maxX) / 2)
        const centerY = Math.floor((minY + maxY) / 2)
        params.set('center', `${centerX},${centerY}`)
      }

      if (!options.size) {
        const sizeX = maxX - minX
        const sizeY = maxY - minY
        const size = Math.floor(
          Math.min(height, width) / Math.max(sizeX, sizeY)
        )
        params.set('size', String(Math.min(Math.max(size, 5), 20)))
      }
    }

    const qs = params.toString()
    return this.url('/v2/map.png' + (qs ? '?' : '') + qs)
  }
}
