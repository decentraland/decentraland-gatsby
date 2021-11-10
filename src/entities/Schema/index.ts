import Ajv from 'ajv'
import addFortmas from 'ajv-formats'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

export default addFortmas(new Ajv()).addFormat('address', isEthereumAddress)
