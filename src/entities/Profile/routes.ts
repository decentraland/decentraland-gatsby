import { Response } from "express";
import isURL from "validator/lib/isURL";
import routes from "../Route/routes";
import { withProfile, WithProfile } from "./middleware";

const DEFAULT_AVATAR = 'https://peer.decentraland.org/content/contents/QmVfTSvEJBtmaHrnmZtpoVCSpv2J69M1wqA97dc53DgbWG'

export default routes((router) => {
  router.get('/profile/:user/face.png', withProfile({ optional: true }), redirectToFace)
  router.get('/profile/:user/body.png', withProfile({ optional: true }), redirectToBody)
})

export function redirectTo(res: Response, url?: string | null) {
  if (typeof url !== 'string' || !isURL(url)) {
    url = DEFAULT_AVATAR
  }

  res.setHeader('Cache-Control', 'max-age=86400')
  res.redirect(302, url)
}

export function redirectToFace(req: WithProfile, res: Response) {
  redirectTo(res, req.profile?.avatar?.snapshots?.face)
}

export function redirectToBody(req: WithProfile, res: Response) {
  redirectTo(res, req.profile?.avatar?.snapshots?.body)
}