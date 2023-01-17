import singleton from './singleton'

describe('utils/immutalbe/singleton', () => {
  test('generates same value for same object', () => {
    const objA = {}
    const objB = {}
    expect(singleton(objA)).toBe(singleton(objA))
    expect(singleton(objB)).toBe(singleton(objB))
    expect(singleton(Math)).toBe(singleton(Math))
  })

  it('generates different hashes for different objects', () => {
    const objA = {}
    const objB = {}
    expect(singleton(objA)).toBe(singleton(objA))
    expect(singleton(objA)).not.toBe(singleton(objB))
    expect(singleton(Math)).not.toBe(singleton(objA))
    expect(singleton(Math)).not.toBe(singleton(objB))
  })

  it('generates different hashes for different functions', () => {
    const funA = () => {
      return
    }
    const funB = () => {
      return
    }
    expect(singleton(funA)).toBe(singleton(funA))
    expect(singleton(funA)).not.toBe(singleton(funB))
  })
})
