import Catalyst, { Avatar } from '../api/Catalyst'
import rollbar from '../development/rollbar'
import segment from '../development/segment'
import BatchLoader from './BatchLoader'

const DEFAULT_AVATAR = 'https://decentraland.org/images/male.png'

export type Profile = Omit<Avatar, 'avatar'> &
  Partial<Pick<Avatar, 'avatar'>> & {
    isDefaultProfile?: boolean
  }

export const createDefaultProfile = (address: string): Profile => ({
  userId: address,
  ethAddress: address,
  hasClaimedName: false,
  avatar: {
    snapshots: {
      face: DEFAULT_AVATAR,
      body: '',
    },
    bodyShape: 'dcl://base-avatars/BaseMale',
    eyes: {
      color: {
        r: 0.125,
        g: 0.703125,
        b: 0.96484375,
      },
    },
    hair: {
      color: {
        r: 0.234375,
        g: 0.12890625,
        b: 0.04296875,
      },
    },
    skin: {
      color: {
        r: 0.94921875,
        g: 0.76171875,
        b: 0.6484375,
      },
    },
    wearables: [
      'dcl://base-avatars/green_hoodie',
      'dcl://base-avatars/brown_pants',
      'dcl://base-avatars/sneakers',
      'dcl://base-avatars/casual_hair_01',
      'dcl://base-avatars/beard',
    ],
    version: 0,
  },
  name: '',
  email: '',
  description: '',
  blocked: [],
  inventory: [],
  version: 0,
  tutorialStep: 0,
  isDefaultProfile: true,
})

export default new BatchLoader<Profile>(
  async (addresses: string[]) => {
    try {
      const profiles = await Catalyst.get().getProfiles(
        addresses.map((address) => address.toLowerCase())
      )
      return profiles.map(
        (profile, i) => profile || createDefaultProfile(addresses[i])
      )
    } catch (err) {
      console.error(err)
      rollbar((rollbar) => rollbar.error(err))
      segment((analytics) => analytics.track('error', {
        ...err,
        message: err.message,
        stack: err.stack,
      }))
      return addresses.map((address) => createDefaultProfile(address))
    }
  },
  { maxBatchSize: 100 }
)
