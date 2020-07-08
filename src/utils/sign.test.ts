import { sign, decode, verify } from './sign';

describe('utils/sign', () => {
  test(`sign`, () => expect(sign({}, '123456')).toBe('e30=.65X0tumNLI9khJR9B7cM1yZHTKndoWU1n3tlRkBqfkI='))
  test(`decode`, () => {
    const secret = '123456'
    const data1 = { random: Math.random() }
    const data2 = { random: Math.random() }
    const data3 = { random: Math.random() }
    const sign1 = sign(data1, secret)
    const sign2 = sign(data2, secret)
    const sign3 = sign(data3, secret)
    expect(decode(sign1)).toEqual(data1)
    expect(decode(sign2)).toEqual(data2)
    expect(decode(sign3)).toEqual(data3)
    expect(decode('111' + sign1)).toEqual(null)
  })
  test(`verify`, () => {
    const secret = '123456'
    const data1 = { random: Math.random() }
    const data2 = { random: Math.random() }
    const data3 = { random: Math.random() }
    const sign1 = sign(data1, secret)
    const sign2 = sign(data2, secret)
    const sign3 = sign(data3, secret)
    expect(verify(sign1, secret)).toEqual(data1)
    expect(verify(sign2, secret)).toEqual(data2)
    expect(verify(sign3, secret)).toEqual(data3)

    // invalids
    expect(verify(sign3 + 'extra', secret)).toEqual(null)
    expect(verify(sign3, '111111')).toEqual(null)
    expect(verify('', secret)).toEqual(null)
  })
})