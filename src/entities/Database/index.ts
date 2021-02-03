import { db } from 'decentraland-server'
import env from '../../utils/env'

// TODO v3: move from index.tss
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
    const url = new URL(CONNECTION_STRING)
    if (url.searchParams.get('schema')) {
      await client.query(`SET search_path TO ${url.searchParams.get('schema')}`)
    }

    if(url.username || url.password) {
      url.username = '******'
      url.password = ''
    }

    console.log(`connecting to database: ${url.toString()}`)
  } catch (err) {
    console.error(err)
  }

  return client
}

export default database;
