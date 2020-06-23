import { db } from 'decentraland-server'
import env from '../../utils/env'
import { parse } from 'url'

const pg = db.clients.postgres

const database: typeof pg = Object.create(pg)

pg.setTypeParser(1114, (date: string) => {
  const utcStr = `${date}Z`
  return new Date(utcStr).toISOString()
})

database.connect = async () => {
  const CONNECTION_STRING = env('CONNECTION_STRING', '')
  const client = await pg.connect(CONNECTION_STRING)

  try {
    const url = parse(CONNECTION_STRING)
    if (url.query) {
      const params = new URLSearchParams(url.query || '')
      const schema = params.get('schema')
      if (schema) {
        await client.query(`SET search_path TO ${schema}`)
      }
    }
  } catch (err) {
    console.error(err)
  }

  return client
}

export default database;
