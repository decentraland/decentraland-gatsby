import Ajv from 'ajv'
import isEmail from 'validator/lib/isEmail'
import isUUID from 'validator/lib/isUUID'
import isURL from 'validator/lib/isURL'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

export default new Ajv()
  .addFormat('address', isEthereumAddress)
  .addFormat('email', isEmail)
  .addFormat('uuid', isUUID)
  .addFormat('url', (url) => isURL(url, {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: true
  }))