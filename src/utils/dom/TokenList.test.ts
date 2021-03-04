import TokenList from './TokenList'

describe('TokenList', () => {
  test('#join', () => {
    expect(TokenList.join([])).toEqual('')
    expect(TokenList.join(['token1'])).toEqual('token1')
    expect(TokenList.join(['token1', null, undefined, false, false && 'token2', true && 'token3'])).toEqual('token1 token3')
  })

  test('constructor', () => {
    expect(new TokenList().value).toEqual('')
    expect(new TokenList('token1 token2').value).toEqual('token1 token2')
  })

  test('item', () => {
    const list = new TokenList('token1 token2')
    expect(list.item(0)).toEqual('token1')
    expect(list.item(1)).toEqual('token2')
    expect(list.item(2)).toEqual(undefined)
  })

  test('contains', () => {
    const list = new TokenList('token1 token2')
    expect(list.contains('')).toEqual(false)
    expect(list.contains('token1')).toEqual(true)
    expect(list.contains('token2')).toEqual(true)
    expect(list.contains('token3')).toEqual(false)
    expect(list.contains('token1 token2')).toEqual(true)
    expect(list.contains('token2 token1')).toEqual(true)
    expect(list.contains('token2 token1 token3')).toEqual(false)
  })

  test('add', () => {
    expect(new TokenList('token1').add('token2').value).toEqual('token1 token2')
    expect(new TokenList('token1').add('token1 token2', 'token3').add('token2 token4').value).toEqual('token1 token2 token3 token4')
  })

  test('remove', () => {
    expect(new TokenList('token1').remove('token2').value).toEqual('token1')
    expect(new TokenList('token1 token2').remove('token2').value).toEqual('token1')
    expect(new TokenList('token1 token2 token3').remove('token2').value).toEqual('token1 token3')
  })

  test('replace', () => {
    const tokens = new TokenList('token1')
    expect(tokens.replace('token2', 'token3').value).toEqual('token1')
    expect(tokens.value).toEqual('token1')
    expect(tokens.add('token2').value).toEqual('token1 token2')
    expect(tokens.replace('token2', 'token3').value).toEqual('token1 token3')
    expect(tokens.replace('token4', 'token3').value).toEqual('token1 token3')
    expect(tokens.replace('token1', 'token3').value).toEqual('token3')
  })

  test('toggle', () => {
    const tokens = new TokenList('token1')
    expect(tokens.toggle('toggle').value).toEqual('token1 toggle')
    expect(tokens.toggle('toggle').value).toEqual('token1')
    expect(tokens.toggle('toggle', true).value).toEqual('token1 toggle')
    expect(tokens.toggle('toggle', true).value).toEqual('token1 toggle')
    expect(tokens.toggle('toggle', false).value).toEqual('token1')
    expect(tokens.toggle('toggle', false).value).toEqual('token1')
  })

  test('entries', () => {
    const tokens = new TokenList('token1 token2')
    expect(Array.from(tokens.entries())).toEqual([[0, 'token1'], [1, 'token2']])
  })

  test('keys', () => {
    const tokens = new TokenList('token1 token2')
    expect(Array.from(tokens.keys())).toEqual([0, 1])
  })

  test('values', () => {
    const tokens = new TokenList('token1 token2')
    expect(Array.from(tokens.values())).toEqual(['token1', 'token2'])
  })
})