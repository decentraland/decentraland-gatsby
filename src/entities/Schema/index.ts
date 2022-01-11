import Ajv from 'ajv'
import addFormas, { FormatsPluginOptions } from 'ajv-formats'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import isNumeric from 'validator/lib/isNumeric'
import isInt from 'validator/lib/isInt'

const formats: FormatsPluginOptions = [
  'time',
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
