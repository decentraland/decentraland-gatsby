import API from 'decentraland-gatsby/dist/utils/api/API'
import env from 'decentraland-gatsby/dist/utils/env'

const GATSBY_BASE_URL = env('GATSBY_BASE_URL', '/')

export default {
  home: () => API.url(GATSBY_BASE_URL, '/'),
}
