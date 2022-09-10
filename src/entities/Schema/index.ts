import { default as Ajv, JSONSchemaType } from 'ajv'
import addFormas, { FormatsPluginOptions } from 'ajv-formats'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import isInt from 'validator/lib/isInt'
import isNumeric from 'validator/lib/isNumeric'

import { default as schema } from './schema'

const formats: FormatsPluginOptions = [
  'time',
  'date',
  'date-time',
  'duration',
  'uri',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'regex',
  'uuid',
]

export default addFormas(new Ajv(), formats)
  .addFormat('address', isEthereumAddress)
  .addFormat('int', isInt)
  .addFormat('uint', (value: string) => isInt(value, { min: 0 }))
  .addFormat('float', isNumeric)

export { Ajv, JSONSchemaType, schema }
