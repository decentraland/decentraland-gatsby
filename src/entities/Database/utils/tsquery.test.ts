import tsquery from './tsquery'

describe('tsquery', () => {
  test(`should preserve behavior`, () => {
    expect(tsquery('foo')).toBe('foo:*')
    expect(tsquery('foo bar')).toBe('foo:*&bar:*')
    expect(tsquery('-bar')).toBe('!bar')
    expect(tsquery('foo -bar')).toBe('foo:*&!bar')
    expect(tsquery('foo !bar')).toBe('foo:*&!bar')
    expect(tsquery('foo + !bar')).toBe('foo:*&!bar')
    expect(tsquery('foo bar,bip')).toBe('foo:*&bar:*|bip:*')
    expect(tsquery('foo+bar | bip')).toBe('foo:*&bar:*|bip:*')
    expect(tsquery('foo (bar,bip)')).toBe('foo:*&(bar:*|bip:*)')
    expect(tsquery('foo+(bar|bip)')).toBe('foo:*&(bar:*|bip:*)')
    expect(tsquery('foo>bar>bip')).toBe('foo<->bar<->bip')
    expect(tsquery('foo*,bar* bana:*')).toBe('foo:*|bar:*&bana:*')
  })
})
