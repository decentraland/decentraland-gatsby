import express from 'express'
// import { databaseInitializer } from 'decentraland-gatsby/dist/entities/Database/utils'
// import manager from 'decentraland-gatsby/dist/entities/Job/index'
// import { jobInitializer } from 'decentraland-gatsby/dist/entities/Job/utils'
import {
  status,
  filesystem,
} from 'decentraland-gatsby/dist/entities/Route/routes'
import {
  withDDosProtection,
  withLogs,
  withCors,
  withBody,
} from 'decentraland-gatsby/dist/entities/Route/middleware'
import metrics from 'decentraland-gatsby/dist/entities/Prometheus/routes'
import handle from 'decentraland-gatsby/dist/entities/Route/handle'
import RequestError from 'decentraland-gatsby/dist/entities/Route/error'
import { serverInitializer } from 'decentraland-gatsby/dist/entities/Server/utils'
import { initializeServices } from 'decentraland-gatsby/dist/entities/Server/handler'
import env from 'decentraland-gatsby/dist/utils/env'

// const jobs = manager()
// jobs.cron('@eachMinute', () => console.log('Runnign Job...'))

const app = express()
app.set('x-powered-by', false)
app.use(withLogs())
app.use('/api', [
  status(),
  withDDosProtection(),
  withCors(),
  withBody(),
  handle(async () => {
    throw new RequestError('NotFound', RequestError.NotFound)
  }),
])

app.use(metrics)
app.use(filesystem('public', '404.html'))

initializeServices([
  // env('DATABASE', 'true) !== 'false' && databaseInitializer(),
  // env('JOBS', 'true) !== 'false' && jobInitializer(jobs),
  env('HTTP', 'true') !== 'fase' &&
    serverInitializer(app, Number(env('PORT', '4000')), process.env.HOST),
])
