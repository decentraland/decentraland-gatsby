import TokenList from './TokenList'

describe('TokenList', () => {
  test('#parse', () => {
    expect(TokenList.parse('')).toEqual([])
    expect(TokenList.parse('a')).toEqual(['a'])
    expect(TokenList.parse('a b')).toEqual(['a', 'b'])
    expect(TokenList.parse('a b c')).toEqual(['a', 'b', 'c'])
    expect(TokenList.parse('a b b c')).toEqual(['a', 'b', 'c'])
  })

  test('#from', () => {
    expect(TokenList.from('').value).toEqual('')
    expect(TokenList.from('a').value).toEqual('a')
    expect(TokenList.from('a b').value).toEqual('a b')
    expect(TokenList.from('a b', 'c').value).toEqual('a b c')
    expect(TokenList.from('a b', 'b c').value).toEqual('a b c')
  })

  test('#join', () => {
    expect(TokenList.join([])).toEqual('')
    expect(TokenList.join(['token1'])).toEqual('token1')
    expect(
      TokenList.join([
        'token1',
        null,
        undefined,
        false,
        false && 'token2',
        true && 'token3',
      ])
    ).toEqual('token1 token3')
  })

  test('item: should return the token associated with that index', () => {
    const token = TokenList.from('token1 token2')
    expect(token.item(-1)).toEqual(null)
    expect(token.item(0)).toEqual('token1')
    expect(token.item(1)).toEqual('token2')
    expect(token.item(2)).toEqual(null)
  })

  test('contains: should return false if the string is empty or there is any space', () => {
    const list = TokenList.from('token1 token2')
    expect(list.contains('')).toEqual(false)
    expect(list.contains('token1 token2')).toEqual(false)
  })

  test("contains: should return false if the token isn't in the list", () => {
    const list = TokenList.from('token1 token2')
    expect(list.contains('token3')).toEqual(false)
  })

  test('contains: should return true if the token is in the list', () => {
    const list = TokenList.from('token1 token2')
    expect(list.contains('token1')).toEqual(true)
    expect(list.contains('token2')).toEqual(true)
  })

  test('contains: should be case sensitive', () => {
    const list = TokenList.from('token1 token2')
    expect(list.contains('TOKEN1')).toEqual(false)
    expect(list.contains('TOKEN2')).toEqual(false)
  })

  test('add: should fail if the new token is empty or contains any espace', () => {
    const token = TokenList.from('token1')
    expect(() => token.add('')).toThrowError()
    expect(() => token.add('token2 token3')).toThrowError()
    expect(token.value).toEqual('token1')
  })

  test('add: should add a new token', () => {
    const token = TokenList.from('token1')
    token.add('token2')
    expect(token.value).toEqual('token1 token2')
  })

  test("add: shouldn't add a new token if already exists", () => {
    const token = TokenList.from('token1 token2')
    token.add('token1')
    expect(token.value).toEqual('token1 token2')
  })

  test('add: should be case sensitive', () => {
    const token = TokenList.from('token1 token2')
    token.add('TOKEN1')
    expect(token.value).toEqual('token1 token2 TOKEN1')
  })

  test('remove: should fail if the token is empty or contains any espace', () => {
    const token = TokenList.from('')
    expect(() => token.remove('')).toThrowError()
    expect(() => token.remove('token1 token2')).toThrowError()
  })

  test('remove: should remove the token if exists', () => {
    const token = TokenList.from('token1 token2')
    token.remove('token2')
    expect(token.value).toEqual('token1')
  })

  test('remove: should preserve the token order', () => {
    const token = TokenList.from('token1 token2 token3')
    token.remove('token2')
    expect(token.value).toEqual('token1 token3')
  })

  test('remove: should be case sensitive', () => {
    const token = TokenList.from('token1 token2')
    token.remove('TOKEN1')
    expect(token.value).toEqual('token1 token2')
  })

  test('replace: should fail if the token is empty or contains any espace', () => {
    const token = TokenList.from('token1')
    expect(() => token.replace('token1', '')).toThrowError()
    expect(() => token.replace('', 'token2')).toThrowError()
    expect(() => token.replace('token1 token1', 'token2')).toThrowError()
    expect(() => token.replace('token1', 'token2 token2')).toThrowError()
  })

  test("replace: should retun false if the token wasn't replace", () => {
    const token = TokenList.from('token1')
    const replace = token.replace('token2', 'token3')
    expect(replace).toEqual(false)
    expect(token.value).toEqual('token1')
  })

  test('replace: should return true if the token was replaced', () => {
    const token = TokenList.from('token1 token2')
    const replace = token.replace('token2', 'token3')
    expect(replace).toBe(true)
    expect(token.value).toBe('token1 token3')
  })

  test('replace: should preserve the order of the tokens', () => {
    const token = TokenList.from('token1 token2 token3')
    const replace = token.replace('token2', 'token4')
    expect(replace).toBe(true)
    expect(token.value).toBe('token1 token4 token3')
  })

  test('replace: should remove the token if the new token already exists', () => {
    const token = TokenList.from('token1 token2 token3')
    const replace = token.replace('token2', 'token3')
    expect(replace).toBe(true)
    expect(token.value).toBe('token1 token3')
  })

  test('toggle: should fail if the token is empty or contains any espace', () => {
    const token = TokenList.from('')
    expect(() => token.toggle('')).toThrowError()
    expect(() => token.toggle('token1 token2')).toThrowError()
  })

  test('toggle: should return true if the new token was added', () => {
    const token = TokenList.from('token1')
    const toggle = token.toggle('toggle')
    expect(toggle).toEqual(true)
    expect(token.value).toEqual('token1 toggle')
  })

  test('toggle: should return true if the new token was removed', () => {
    const token = TokenList.from('token1 toggle')
    const toggle = token.toggle('toggle')
    expect(toggle).toEqual(false)
    expect(token.value).toEqual('token1')
  })

  test('toggle: should force the new token if the second parameter is true', () => {
    const token = TokenList.from('token1')
    const toggle1 = token.toggle('toggle', true)
    expect(toggle1).toEqual(true)
    expect(token.value).toEqual('token1 toggle')

    const toggle2 = token.toggle('toggle', true)
    expect(toggle2).toEqual(true)
    expect(token.value).toEqual('token1 toggle')
  })

  test('toggle: should remove the new token if the second parameter is false', () => {
    const token = TokenList.from('token1 toggle')
    const toggle1 = token.toggle('toggle', false)
    expect(toggle1).toEqual(false)
    expect(token.value).toEqual('token1')

    const toggle2 = token.toggle('toggle', false)
    expect(toggle2).toEqual(false)
    expect(token.value).toEqual('token1')
  })

  test('keys', () => {
    const tokens = TokenList.from('token1 token2')
    expect(Array.from(tokens.keys())).toEqual([0, 1])
  })

  test('values', () => {
    const tokens = TokenList.from('token1 token2')
    expect(Array.from(tokens.values())).toEqual(['token1', 'token2'])
  })
})
