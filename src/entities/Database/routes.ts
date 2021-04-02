import isAdmin from "../Auth/isAdmin";
import { auth, WithAuth } from "../Auth/middleware";
import handleAPI from "../Route/handle";
import routes from "../Route/routes";
import { getQueryHash } from "./metrics";

export default routes((router) => {
  router.get('/debug/:hash', auth(), handleAPI(async (req: WithAuth) => {
    if (!isAdmin(req.auth)) {
      return null
    }

    return getQueryHash(req.params['hash'])
  }))
})