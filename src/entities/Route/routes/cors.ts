import expressCors from 'cors'
import { createCorsOptions, CorsOptions } from '../types';

export default function cors(options: CorsOptions = {}) {
  return expressCors(createCorsOptions(options))
}
