import { Address } from "web3x/address";
import { AuthIdentity } from "dcl-crypto/dist/types";
import { Avatar } from "../api/Katalyst";

export type Profile = {
  address: Address,
  identity: AuthIdentity,
  avatar: Avatar | null
}

export type ProfileChangeEvent = {
  local: boolean,
  oldProfile: Profile | null,
  newProfile: Profile | null,
}