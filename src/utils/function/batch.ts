import logger from '../../entities/Development/logger'

type BatchCallback<T> = (batch: T[]) => Promise<any>

export default function batch<T>(
  callback: BatchCallback<T>,
  limit: number = 100
) {
  let queue: { item: T; callback: () => void }[] = []
  let exec: null | Promise<any> = null

  function run() {
    if (queue.length > 0 && exec === null) {
      exec = Promise.resolve().then(async () => {
        const current = queue.slice(0, limit)
        queue = queue.slice(limit)
        try {
          await callback(current.map((value) => value.item))
          current.map((value) => value.callback())
          exec = null
          run()
        } catch (err) {
          logger.error(`Error processing batch: ${err.message}`, err)
          exec = null
          run()
        }
      })
    }
  }

  return async function batcher(item: T) {
    return new Promise<void>((callback) => {
      queue.push({ item, callback })
      if (!exec) {
        run()
      }
    })
  }
}
