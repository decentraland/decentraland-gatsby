import Ddos from 'ddos'

import RequestError from '../error'
import { DDosOptions } from '../types'

export default function withDDosProtection(options: Partial<DDosOptions> = {}) {
  const config: Partial<DDosOptions> & { errormessage: string } = {
    checkinterval: 5,
    limit: 500,
    ...options,
    errormessage: JSON.stringify(
      RequestError.toJSON(
        new RequestError('Too many requests', RequestError.TooManyRequests)
      )
    ),
  }
  const protection = new Ddos(config)
  return protection.express
}
