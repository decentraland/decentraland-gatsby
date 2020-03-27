import { db } from 'decentraland-server'
import env from '../../utils/env'

const pg = db.clients.postgres

const database: typeof pg = Object.create(pg)

pg.setTypeParser(1114, (date: string) => {
  const utcStr = `${date}Z`
  return new Date(utcStr).toISOString()
})

database.connect = async () => {
  const CONNECTION_STRING = env('CONNECTION_STRING', '')
  return pg.connect(CONNECTION_STRING)
}

export default database;
