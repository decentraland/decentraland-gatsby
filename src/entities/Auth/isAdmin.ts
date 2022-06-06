import { yellow } from 'colors/safe'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import env from '../../utils/env'

const adminAddresses = new Set(
  (env('ADMIN_ADDRESSES', '') || '')
    .split(',')
    .filter(isEthereumAddress)
    .map((address) => address.toLowerCase())
)

adminAddresses.forEach((address) =>
  console.log('admin address:', yellow(address))
)

export default function isAdmin(user?: string | null | undefined) {
  if (!user) {
    return false
  }

  return adminAddresses.has(user)
}

export function listAdmins() {
  return Array.from(adminAddresses.values())
}
