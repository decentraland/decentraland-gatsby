export type Snapshot = {
  face: string
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
    version: number
  }
  inventory: string[]
  blocked: string[]
  tutorialStep: number
}

export type ProfileResponse = {
  avatars: Avatar[]
}

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
      contentRating: 'E' | 'T' | 'M'
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
