import Catalyst, { Avatar } from "../api/Catalyst"
import BatchLoader from "./BatchLoader"

export type Profile = Omit<Avatar, 'avatar'> & Partial<Pick<Avatar, 'avatar'>> & {
  isDefaultProfile?: boolean
}

const defaultProfile = (address: string): Profile => ({
  userId: address,
  ethAddress: address,
  hasClaimedName: false,
  name: '',
  email: '',
  description: '',
  blocked: [],
  inventory: [],
  version: 0,
  tutorialStep: 0,
  isDefaultProfile: true
})

export default new BatchLoader<Profile>(async (addresses: string[]) => {
  try {
    const catalyst = await Catalyst.getAny()
    const profiles = await catalyst.getProfiles(addresses.map(address => address.toLowerCase()))
    return profiles.map((profile, i) => profile || defaultProfile(addresses[i]))
  } catch (err) {
    console.error(err)
    return addresses.map(address => defaultProfile(address))
  }
}, { maxBatchSize: 100 })