import isEthereumAddress from "validator/lib/isEthereumAddress"
import Catalyst, { Avatar } from "../api/Catalyst"
import Loader from "./Loader"

export type Profile = Omit<Avatar, 'avatar'> & Partial<Pick<Avatar, 'avatar'>> & {
  isDefaultProfile?: boolean,
  invalidAddress?: boolean,
  invalidServerResponse?: boolean,
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

export default new Loader<Profile>(async (address: string) => {
  address = address.toLowerCase()

  if (!isEthereumAddress(address)) {
    return {
      ...defaultProfile(address),
      invalidAddress: true
    }
  }

  try {
    const catalyst = await Catalyst.getAny()
    const profiles = await catalyst.getProfiles([address])
    // const profile = await Catalyst.get().getProfile(address)
    const profile = profiles[0]
    if (profile) {
      return profile
    }

    return defaultProfile(address)
  } catch (err) {
    console.error(err)
    return {
      ...defaultProfile(address),
      invalidServerResponse: true,
    }
  }
})