import type { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import type { EntityType } from '@dcl/schemas/dist/platform/entity'

export type Snapshot = {
  face?: string
  face128?: string
  face256?: string
  body: string
}

export type BodyColor = {
  color: {
    r: number
    g: number
    b: number
    a?: number
  }
}

export enum SceneContentRating {
  RATING_PENDING = 'RP',
  EVERYONE = 'E',
  TEEN = 'T',
  ADULT = 'A',
  RESTRICTED = 'R',
}

/** @deprecated use @dcl/schemas/dist/platform/profile/avatar */
export type Avatar = {
  userId: string
  email: string | null | undefined
  name: string | null | undefined
  hasClaimedName: boolean
  description: string | null | undefined
  ethAddress: string
  version: number
  avatar: {
    bodyShape: string
    snapshots: Snapshot
    eyes: BodyColor
    hair: BodyColor
    skin: BodyColor
    wearables: string[]
    emotes?: { slot: number; urn: string }[]
    version?: number
  }
  inventory?: string[]
  blocked?: string[]
  tutorialStep: number
  hasConnectedWeb3?: boolean
}

export type ProfileMetadata = {
  avatars: Avatar[]
}

export type ProfileResponse = ProfileMetadata

export type Layer = {
  name: string
  usersCount: number
  maxUsers: number
}

export type CommsStatusOptions =
  | boolean
  | {}
  | { includeLayers: boolean }
  | { includeUsersParcels: boolean }

export type Status = CommsStatus
export type StatusWithLayers = CommsStatusWithLayers

export type CommsStatus = {
  name: string
  version: string
  currenTime: number
  env: {
    secure: boolean
    commitHash: string
  }
  ready: boolean
}

export type CommsStatusWithLayers = CommsStatus & {
  layers: (Layer & { usersParcels: Position[] })[]
}

export type CommsStatusWithUsers = CommsStatus & {
  usersCount: number
  usersParcels: [number, number][]
}

export type CatalystAbout = {
  healthy: boolean
  content: {
    healthy: boolean
    version: string //"6.0.6",
    commitHash: string //"d2eeccaffe2a9c22ac963348851c7791b63fc517",
    publicUrl: string //"https://peer.decentraland.org/content/"
  }
  lambdas: {
    healthy: boolean
    version: string //"6.0.6",
    commitHash: string //"d2eeccaffe2a9c22ac963348851c7791b63fc517",
    publicUrl: string //"https://peer.decentraland.org/lambdas/"
  }
  configurations: {
    networkId: ChainId
    globalScenesUrn: string[]
    scenesUrn: string[]
    realmName: string // "hera"
  }
  comms: {
    healthy: boolean
    protocol: string // "v3",
    commitHash: string //"b3ec3327ceef53473853068dcdad8ea08d7a0f9c"
  }
  bff: {
    healthy: boolean
    commitHash: string //"4352737ca24a0c590387fba4b46da297408e899a",
    userCount: number
    protocolVersion: string //"1.0_0",
    publicUrl: string //"/bff"
  }
  acceptingUsers: boolean
}

export type LambdasStatus = {
  version: string
  currentTime: number
  contentServerUrl: string
  commitHash: string
}

export type ContentStatus = {
  name: string
  version: string
  currentTime: number
  lastImmutableTime: number
  historySize: number
  synchronizationStatus: {
    otherServers: {
      address: string
      connectionState:
        | 'Connected'
        | 'Connection lost'
        | 'Could never be reached'
      lastDeploymentTimestamp: number
    }[]
    lastSyncWithDAO: number
    synchronizationState:
      | 'Bootstrapping'
      | 'Syncing'
      | 'Synced'
      | 'Failed to sync'
    lastSyncWithOtherServers: number
  }
  commitHash: string
  ethNetwork: string
}

export type Position = [number, number]
export type Position3D = {
  x: number
  y: number
  z: number
}

export type Servers = {
  baseUrl: string
  owner: string
  id: string
}

export type Realm = {
  serverName: string
  url: string
  usersCount: number
  maxUsers: number
  userParcels: [number, number][]
}

export type HotScene = {
  id: string
  name: string
  baseCoords: [number, number]
  usersTotalCount: number
  parcels: [number, number][]
  thumbnail: string
  creator: string
  description: string
  realms: Realm[]
}

export type WorldLivePerWorldProps = {
  users: number
  worldName: string
}

export type WorldLiveDataProps = {
  perWorld: WorldLivePerWorldProps[]
  totalUsers: number
}

export type LayerUser = {
  id: string
  userId: string
  protocolVersion: number
  peerId: string
  parcel: [number, number]
  position: [number, number, number]
  lastPing: number
  address: string
}

/**@deprecated */
export type EntityScene = {
  id: string
  type: 'scene'
  timestamp: number
  pointers: string[]
  content: {
    file: string
    hash: string
  }[]
  metadata: {
    display: {
      title: string | 'interactive-text'
      description?: string
      navmapThumbnail?: string
      favicon: 'favicon_asset'
    }
    contact: {
      name: string
      email: string
    }
    owner: string
    scene: {
      parcels: string[]
      base: string
    }
    communications: {
      type: 'webrtc'
      signalling: string
    }
    policy: {
      contentRating: SceneContentRating
      fly: boolean
      voiceEnabled: boolean
      blacklist: []
    }
    main: string
    tags: string[]
    spawnPoints: [
      {
        name: 'spawn1'
        default: boolean
        position: Position3D
        cameraTarget: Position3D
      }
    ]
  }
}

export type Peer = {
  id: string
  address: string
  parcel: [number, number]
  position: [number, number, number]
  lastPing: number
}

export enum ContentDeploymentSortingField {
  LocalTimestamp = 'local_timestamp',
  EntityTimestamp = 'entity_timestamp',
}

export enum ContentDeploymentSortingOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
}

export type ContentDeploymentOptions = {
  offset: number
  limit: number
  from: number | Date
  to: number | Date
  onlyCurrentlyPointed: boolean
  lastId: string
  entityIds: string[]
  entityTypes: EntityType[]
  sortingField: ContentDeploymentSortingField
  sortingOrder: ContentDeploymentSortingOrder
}

export type ContentDeployment =
  | ContentDeploymentScene
  | ContentDeploymentProfile
  | ContentDeploymentWearable
  | ContentDeploymentStore
  | ContentDeploymentEmote
  | ContentDeploymentWorld

export type ContentDeploymentBase = {
  entityId: string
  entityTimestamp: number
  localTimestamp: number
  deployedBy: string
  pointers: string[]
  content: { key: string; hash: string }[]
}

export type SceneMetadata = {
  display?: {
    title?: string // "My Cool Scene",
    description?: string // "You won't believe how cool this scene is",
    favicon?: string // "favicon_asset",
    navmapThumbnail?: string // "scene-thumbnail.png" | "https://decentraland.org/images/thumbnail.png"
  }
  owner?: string
  contact?: {
    name?: string
    email?: string
  }
  main?: string // "bin/game.js",
  tags?: string[]
  scene?: {
    parcels: string[]
    base: string
  }
  requiredPermissions?: string[]
  spawnPoints?: {
    name: string
    default: boolean
    position: {
      x: number[]
      y: number[]
      z: number[]
    }
    cameraTarget: {
      x: number
      y: number
      z: number
    }
  }[]
  communications?: {
    type: string // "webrtc",
    signalling: string // "https://signalling-01.decentraland.org"
  }
  policy?: {
    contentRating: SceneContentRating
    fly: boolean
    voiceEnabled: boolean
    blacklist: string[]
    teleportPosition: string
  }
  source?: {
    version: number
    origin: string
    projectId: string
    point: {
      x: number
      y: number
    }
    rotation: string // "north",
    layout: {
      rows: number // 2,
      cols: number // 1
    }
  }
  worldConfiguration?:
    | {
        name: string
        dclName?: never
        fixedAdapter?: string
        minimapVisible?: boolean
        skybox?: number
        skyboxConfig?: {
          fixedHour: number
          textures: string[]
        }
        placesConfig?: {
          optOut: boolean
        }
      }
    | {
        // old property
        dclName: string
        name?: never
        fixedAdapter?: never
        minimapVisible?: never
        skybox?: never
        skyboxConfig?: never
        placesConfig?: never
      }
}

export type ContentEntity = {
  version: string
  pointers: string[]
  timestamp: number
  content: { file: string; hash: string }[]
}

export type ContentEntityScene = ContentEntity & {
  type: EntityType.SCENE
  metadata: SceneMetadata
}

export type ContentEntityProfile = ContentEntity & {
  type: EntityType.PROFILE
  metadata: ProfileMetadata
}

export type ContentEntityWearable = ContentEntity & {
  type: EntityType.WEARABLE
  metadata: WearableMetadata
}

export type ContentEntityStore = ContentEntity & {
  type: EntityType.STORE
  metadata: StoreMetadata
}

export type ContentEntityEmote = ContentEntity & {
  type: EntityType.EMOTE
  metadata: {} // TODO: emote metadata
}

export type ContentDeploymentScene = ContentDeploymentBase & {
  entityType: EntityType.SCENE
  metadata: SceneMetadata
}

export type ContentDeploymentWorld = ContentDeploymentBase & {
  entityType: EntityType.SCENE
  metadata: SceneMetadata
}

export type ContentDeploymentProfile = ContentDeploymentBase & {
  entityType: EntityType.PROFILE
  metadata: ProfileMetadata
}

export type WearableMetadata = {
  id: string
  name: string
  description: string
  collectionAddress: string
  rarity: string
  image: string
  metrics: {
    triangles: number
    materials: number
    textures: number
    meshes: number
    bodies: number
    entities: number
  }
  thumbnail: string
  data: {
    tags: string[]
    category: string
    representations: {
      mainFile: string // "Earring_SquareEarring.glb"
      bodyShapes: string[] // [ "urn:decentraland:off-chain:base-avatars:BaseFemale" ]
      contents: string[] // [ "AvatarWearables_TX.png", "Earring_SquareEarring.glb" ]
    }[]
  }
  i18n: { code: string; text: string }[]
  createdAt: number
  updatedAt: number
}

export type ContentDeploymentWearable = ContentDeploymentBase & {
  entityType: EntityType.WEARABLE
  metadata: WearableMetadata
}

export type StoreMetadata = {
  id: string
  description: string
  images: { name: string; file: string }[]
  links: { name: string; url: string }[]
  owner: string
  version: number
}

export type ContentDeploymentStore = ContentDeploymentBase & {
  entityType: EntityType.STORE
  metadata: StoreMetadata
}

export type ContentDeploymentEmote = ContentDeploymentBase & {
  entityType: EntityType.EMOTE
  metadata: {} // TODO
}

export type ContentDeploymentResponse = {
  deployments: ContentDeployment[]
  filters: Pick<
    ContentDeploymentOptions,
    'from' | 'to' | 'entityIds' | 'entityTypes'
  >
  pagination: Pick<ContentDeploymentOptions, 'offset' | 'limit' | 'lastId'> & {
    moreData: boolean
    next: string
  }
}

export type StatsParcel = {
  peersCount: number
  parcel: {
    x: number
    y: number
  }
}
