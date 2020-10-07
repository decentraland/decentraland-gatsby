import Ddos from 'ddos'
import { toResponseError } from '../handle';
import { DDosOptions } from '../types';
import RequestError from '../error'

export default function ddos(options: Partial<DDosOptions> = {}) {
  const config: Partial<DDosOptions> & { errormessage: string } = {
    checkinterval: 5,
    limit: 500,
    ...options,
    errormessage: JSON.stringify(toResponseError(
      new RequestError('Too many requests', RequestError.TooManyRequests)
    ))
  }
  const protection = new Ddos(config)
  return protection.express
}
