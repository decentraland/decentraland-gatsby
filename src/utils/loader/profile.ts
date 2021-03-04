import Catalyst, { Avatar } from "../api/Catalyst"
import Loader from "./Loader"

export type Profile = Omit<Avatar, 'avatar'> & Partial<Pick<Avatar, 'avatar'>>

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
})

export default new Loader<Profile>(async (address: string) => {
  address = address.toLowerCase()

  try {
    const profile = await Catalyst.get().getProfile(address)
    return profile || defaultProfile(address)
  } catch (err) {
    return defaultProfile(address)
  }
})