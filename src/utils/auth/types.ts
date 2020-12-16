import { Address } from "web3x/address";
import { AuthIdentity } from "dcl-crypto/dist/types";
import { Avatar } from "../api/Catalyst";

export type Profile = {
  address: Address,
  identity: AuthIdentity,
  avatar: Avatar | null
}

export type ProfileChangeEvent = {
  oldProfile: Profile | null,
  newProfile: Profile | null,
}

export type ProfileExpiredEvent = {
  profile: Profile
}

export type ProfileEffectHandle = {
  error?: (event: Error) => void,
  change?: (event: ProfileChangeEvent) => void,
  expire?: (event: ProfileExpiredEvent) => void,
}