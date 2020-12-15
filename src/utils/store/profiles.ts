import Catalyst, { Avatar } from "../api/Catalyst"
import Loader from "../Loader"

const defaultProfile = (address: string): Avatar => ({
  userId: address,
  ethAddress: address,
  hasClaimedName: false,
  name: '',
  email: ''
} as Avatar)

export default new Loader(async (address: string) => {
  try {
    const profile = await Catalyst.get().getProfile(address)
    return profile || defaultProfile(address)
  } catch (err) {
    return defaultProfile(address)
  }
})