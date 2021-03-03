export type Token = string | undefined | null | false

/**
 * Represents a set of space-separated tokens. It is indexed
 * beginning with 0 as with JavaScript Array objects. TokenList
 * is always case-sensitive.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
 */
export default class TokenList {

  static join(tokens: Token[]) {
    return new TokenList().add(...tokens).value
  }

  private tokens: string[] = []

  constructor(initialValue?: Token) {
    if (initialValue) {
      this.add(initialValue)
    }
  }

  get length() {
    return this.tokens.length
  }

  get value() {
    return Array.from(this.tokens.values()).join(' ')
  }

  item(index: number) {
    return this.tokens[index]
  }

  contains(token: Token) {
    if (!token) {
      return false
    }

    return token.split(/\s+/).every(current => this.tokens.includes(current))
  }

  add(...tokens: Token[]) {

    for (const token of tokens) {
      if (typeof token === 'string') {
        for (const each of token.split(/\s+/)) {
          if (Boolean(each) && !this.contains(each)) {
            this.tokens.push(each)
          }
        }
      }
    }

    return this
  }

  remove(...tokens: Token[]) {
    for (const token of tokens) {
      if (typeof token === 'string') {
        for (const each of token.split(' ')) {
          if (Boolean(each)) {
            this.tokens = this.tokens.filter(current => current !== each)
          }
        }
      }
    }

    return this
  }

  replace(oldToken: Token, newToken: Token) {
    if (!oldToken || !newToken) {
      return this
    }

    if (/s+/.test(newToken)) {
      return this
    }

    const oldExists = this.tokens.includes(oldToken)
    const newExists = this.tokens.includes(newToken)
    const duplicated = oldExists && newExists
    const newTokens = [] as string[]

    for (const current of this.tokens) {
      if (duplicated && current === newToken) {
        // ignore
      } else if (current === oldToken) {
        newTokens.push(newToken)
      } else {
        newTokens.push(current)
      }
    }

    this.tokens = newTokens
    return this
  }

  toggle(token: Token, force?: boolean) {
    if (!token) {
      return this
    }

    if (/s+/.test(token)) {
      return this
    }

    switch (force) {
      case true:
        this.add(token)
        return this

      case false:
        this.remove(token)
        return this

      default:
      // ignore
    }

    const newTokens = this.tokens.filter(current => current !== token)

    // token was removed
    if (newTokens.length !== this.tokens.length) {
      this.tokens = newTokens
    } else {
      this.tokens.push(token)
    }

    return this
  }

  entries() {
    return this.tokens.entries()
  }

  forEach(callback: (value: string, index: number, arr: string[]) => void, thisArg?: any) {
    return this.tokens.forEach(callback, thisArg)
  }

  keys() {
    return this.tokens.keys()
  }

  values() {
    return this.tokens.values()
  }

  [Symbol.iterator]() {
    return this.values()
  }
}