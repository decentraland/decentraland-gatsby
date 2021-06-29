import env from '../../../utils/env'
import handle from '../handle'
import routes from './routes'

const IMAGE = env('IMAGE', `events:${Date.now()}`)
const [image, version] = IMAGE.split(':')

export default function status(extraStatusHandler?: () => Promise<Record<string, any>>) {
  return routes((router) => {
    router.get(
      '/status',
      handle(async () => {
        let extra: Record<string, any> = {}
        if (extraStatusHandler) {
          extra = await extraStatusHandler()
        }

        return {
          image,
          version,
          timestamp: new Date(),
          ...extra
        }
      })
    )
  })
}
