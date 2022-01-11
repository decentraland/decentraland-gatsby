import ajv from './index'

describe('ajv additional fromats', () => {
  describe('fromat: address', () => {
    test(`should return true if an ethereum address was provided`, () => {
      const validator = ajv.compile({
        type: 'string',
        format: 'address',
      })

      expect(validator('0xffffffffffffffffffffffffffffffffffffffff')).toBe(true)
    })

    test(`should return false if an invalid ethereum address was provided`, () => {
      const validator = ajv.compile({
        type: 'string',
        format: 'address',
      })

      expect(validator('ffffffffffffffffffffffffffffffffffffffff')).toBe(false)
      expect(validator('0xfffffffffffffffffffffffffffffffffffffffg')).toBe(
        false
      )
      expect(validator.errors).toEqual([
        {
          instancePath: '',
          keyword: 'format',
          message: 'must match format "address"',
          params: { format: 'address' },
          schemaPath: '#/format',
        },
      ])
    })
  })

  describe('fromat: float', () => {
    test(`should return true if a number was provided`, () => {
      const validator = ajv.compile({
        type: 'string',
        format: 'float',
      })

      expect(validator('-1.5')).toBe(true)
      expect(validator('-1.0')).toBe(true)
      expect(validator('0.0')).toBe(true)
      expect(validator('1.0')).toBe(true)
      expect(validator('1.5')).toBe(true)
      expect(validator('-100')).toBe(true)
      expect(validator('-1')).toBe(true)
      expect(validator('0')).toBe(true)
      expect(validator('1')).toBe(true)
      expect(validator('100')).toBe(true)
    })

    test(`should return false if an invalid number was provided`, () => {
      const validator = ajv.compile({
        type: 'string',
        format: 'float',
      })

      expect(validator('')).toBe(false)
      expect(validator('abc')).toBe(false)
      expect(validator('123abc')).toBe(false)
      expect(validator('1 2 3')).toBe(false)
      expect(validator.errors).toEqual([
        {
          instancePath: '',
          keyword: 'format',
          message: 'must match format "float"',
          params: { format: 'float' },
          schemaPath: '#/format',
        },
      ])
    })
  })

  describe('fromat: int', () => {
    test(`should return true if an integer was provided`, () => {
      const validator = ajv.compile({
        type: 'string',
        format: 'int',
      })

      expect(validator('-100')).toBe(true)
      expect(validator('-1')).toBe(true)
      expect(validator('0')).toBe(true)
      expect(validator('1')).toBe(true)
      expect(validator('100')).toBe(true)
    })

    test(`should return false if an invalid integer was provided`, () => {
      const validator = ajv.compile({
        type: 'string',
        format: 'int',
      })

      expect(validator('')).toBe(false)
      expect(validator('abc')).toBe(false)
      expect(validator('123abc')).toBe(false)
      expect(validator('1 2 3')).toBe(false)
      expect(validator('0.0')).toBe(false)
      expect(validator('-1.0')).toBe(false)
      expect(validator('-1.5')).toBe(false)
      expect(validator.errors).toEqual([
        {
          instancePath: '',
          keyword: 'format',
          message: 'must match format "int"',
          params: { format: 'int' },
          schemaPath: '#/format',
        },
      ])
    })
  })

  describe('fromat: uint', () => {
    test(`should return true if an unsined integer was provided`, () => {
      const validator = ajv.compile({
        type: 'string',
        format: 'uint',
      })

      expect(validator('0')).toBe(true)
      expect(validator('1')).toBe(true)
      expect(validator('100')).toBe(true)
    })

    test(`should return false if an invalid unsigned integer was provided`, () => {
      const validator = ajv.compile({
        type: 'string',
        format: 'uint',
      })

      expect(validator('')).toBe(false)
      expect(validator('abc')).toBe(false)
      expect(validator('123abc')).toBe(false)
      expect(validator('1 2 3')).toBe(false)
      expect(validator('0.0')).toBe(false)
      expect(validator('-1.0')).toBe(false)
      expect(validator('-1.5')).toBe(false)
      expect(validator('-100')).toBe(false)
      expect(validator('-1')).toBe(false)
      expect(validator('--1')).toBe(false)
      expect(validator.errors).toEqual([
        {
          instancePath: '',
          keyword: 'format',
          message: 'must match format "uint"',
          params: { format: 'uint' },
          schemaPath: '#/format',
        },
      ])
    })
  })
})
