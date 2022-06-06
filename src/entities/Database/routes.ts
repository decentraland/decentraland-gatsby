import { Request, Response } from 'express'

import { withPrometheusToken } from '../Prometheus/middleware'
import { handleRaw } from '../Route/handle'
import routes from '../Route/routes'
import { QUERY_HASHES } from './model'

export default routes((router) => {
  const auth = withPrometheusToken({ optional: true })
  router.get(
    '/metrics/database/hashes',
    auth,
    handleRaw(getDatabaseHashes, 'text')
  )
  router.get(
    '/metrics/database/hashes/:hash',
    auth,
    handleRaw(getDatabaseHash, 'text')
  )
})

async function getDatabaseHashes(_: Request, res: Response) {
  res.status(200).send(Array.from(QUERY_HASHES.keys()).join('\n'))
}

async function getDatabaseHash(req: Request, res: Response) {
  const hash = req.params.hash
  if (QUERY_HASHES.has(hash)) {
    res.status(200).send(QUERY_HASHES.get(hash))
  } else {
    res.status(404).send('Not found')
  }
}
