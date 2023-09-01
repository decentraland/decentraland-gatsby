import expressCors from 'cors'

import { CorsOptions, createCorsOptions } from '../types'

export default function withCors(options: CorsOptions = {}) {
  return expressCors(createCorsOptions(options))
}
