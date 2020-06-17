import express from 'express'
import bodyParser from 'body-parser'
import { createReadStream } from 'fs'
import { listen } from 'decentraland-gatsby/dist/entities/Server/utils'
import { status, logger } from 'decentraland-gatsby/dist/entities/Route/routes'

const app = express()

app.use('/api', [
  status(),
  logger(),
  bodyParser.json(),
])

app.use(express.static('public', { maxAge: 1000 * 60 * 60 }))
app.use((_, res) => createReadStream(process.cwd() + '/public/404.html').pipe(res))

Promise.resolve()
  // .then(() => database.connect())
  .then(() => listen(
    app,
    process.env.PORT || 4000,
    process.env.HOST
  ))
