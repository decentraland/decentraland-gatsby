import { Request, Response } from 'express'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import isURL from 'validator/lib/isURL'

import API from '../../utils/api/API'
import Catalyst from '../../utils/api/Catalyst'
import { Profile, createDefaultProfile } from '../../utils/loader/profile'
import routes from '../Route/routes'

const DEFAULT_AVATAR = 'https://decentraland.org/images/male.png'
const TTL_AVATAR = 86400

export default routes((router) => {
  router.get('/profile/:user/face.png', redirectToFace)
  router.get('/profile/:user/body.png', redirectToBody)
})

const cache = new Map<string, Promise<readonly [Profile | null, number]>>()
export async function getProfile(
  req: Request<{ user: string }>
): Promise<Profile> {
  const user = String(req.params.user).toLowerCase()

  // invalid user
  if (!isEthereumAddress(user)) {
    return createDefaultProfile(user)
  }

  // cached user
  const profileCache = cache.get(user)
  if (profileCache) {
    const [profile, ttl] = await profileCache
    if (Date.now() < ttl) {
      if (profile) {
        return profile
      } else {
        return createDefaultProfile(user)
      }
    }
  }

  // no cached user
  const handler = API.catch(Catalyst.get().getProfiles([user]))
    .then((profiles) => (profiles && profiles[0]) || null)
    .then(
      (profile: Profile | null) =>
        [profile, Date.now() + TTL_AVATAR * 1000] as const
    )

  cache.set(user, handler)
  const [profile] = await handler
  if (profile) {
    return profile
  }

  return createDefaultProfile(user)
}

export function redirectToFace(req: Request<{ user: string }>, res: Response) {
  getProfile(req).then((profile) =>
    redirectTo(
      res,
      profile.avatar?.snapshots
        ? profile.avatar.snapshots.face256 || profile.avatar.snapshots.face
        : null
    )
  )
}

export function redirectToBody(req: Request<{ user: string }>, res: Response) {
  getProfile(req).then((profile) =>
    redirectTo(res, profile.avatar?.snapshots?.body)
  )
}

export function redirectTo(res: Response, url?: string | null) {
  if (typeof url !== 'string' || !isURL(url)) {
    url = DEFAULT_AVATAR
  }

  res.setHeader('Cache-Control', 'max-age=' + TTL_AVATAR)
  res.redirect(302, url)
}
